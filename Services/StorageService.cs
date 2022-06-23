using Serilog;
using Tuchka.Entities;
using Tuchka.Models;
using Tuchka.Models.Enums;
using Tuchka.Repository;
using Tuchka.ViewModels;
using Tuchka.ViewModels.Files;

namespace Tuchka.Services;

public interface IStorageService
{
    StorageTree GetStorageTree(Guid userId, Guid? folderId);
    Folder AddFolder(Guid id, CreateFolderRequest model);
    Folder InitMainFolder(Guid userId);
    Task<bool> Upload(User user, Guid folderId, IFormFile file);
    RemoveResult Remove(User user, string entity, Guid id);
    Task<FileResultModel> GetFile(User user, string fileId);
    FileResult Rename(User user, RenameObjectRequestModel request);
}

public class StorageService : IStorageService
{
    private readonly IFoldersRepository _folders;
    private readonly IFilesRepository _files;

    public StorageService(IFoldersRepository foldersRepository,
        IFilesRepository filesRepository)
    {
        _folders = foldersRepository;
        _files = filesRepository;
    }

    public Folder AddFolder(Guid id, CreateFolderRequest model)
    {
        var folder = new Folder
        {
            ColorId = model.ColorId ?? Color.DefaultColorId,
            Name = model.Name,
            OwnerId = id,
            ParentId = model.ParentId
        };

        var result = _folders.Add(folder);
        return result;
    }

    public StorageTree GetStorageTree(Guid userId, Guid? folderId)
    {
        var folder = folderId is null
            ? _folders.GetMainFolder(userId)
            : _folders.GetById(folderId.Value);

        if (folder is null) return null;

        var folders = _folders
            .GetFoldersByParent(folder.Id)
            .OrderBy(f => f.Name)
            .ToList();
        var files = _files
            .GetByFolder(folder.Id)
            .OrderBy(f => f.Name)
            .ToList();

        return new()
        {
            CurrentFolder = folder,
            Folders = folders,
            Files = files
        };
    }

    public Folder InitMainFolder(Guid userId)
    {
        var folder = new Folder
        {
            Name = "Home",
            ColorId = Color.DefaultColorId,
            OwnerId = userId
        };

        var result = _folders.Add(folder);
        return result;
    }

    public async Task<bool> Upload(User user, Guid folderId, IFormFile file)
    {
        var location = await WriteToDisk(file);

        if (string.IsNullOrWhiteSpace(location))
            return false;

        var dbFile = new Entities.File
        {
            Name = file.FileName,
            TypeId = Guid.Parse("2af7630a-c24f-4f02-a991-9a36962beaf4"),
            Location = location,
            OwnerId = user.Id,
            Size = file.Length,
            FolderId = folderId
        };

        var created = _files.Add(dbFile);
        return created is not null;
    }

    public RemoveResult Remove(User user, string entity, Guid id) =>
        entity switch
        {
            "folder" => RemoveFolder(user, id),
            "file" => RemoveFile(user, id),
            _ => RemoveResult.NoSuchType
        };

    private RemoveResult RemoveFolder(User user, Guid id)
    {
        var folder = _folders.GetById(id);

        if (folder is null)
            return RemoveResult.NoSuchObject;

        if (folder.OwnerId != user.Id)
            return RemoveResult.DoesntBelong;

        return RemoveFolder(user.Id, folder);
    }

    private RemoveResult RemoveFolder(Guid userId, Folder folder)
    {
        try
        {
            var tree = GetStorageTree(userId, folder.Id);

            if (tree is null)
                return RemoveResult.NoSuchObject;

            Parallel.ForEach(tree.Files, f =>
                RemoveFile(userId, f.Id));

            if (tree?.Folders?.Count is null or 0)
                _folders.Delete(folder.Id);

            tree.Folders.ForEach(f =>
                RemoveFolder(userId, f));

            return RemoveResult.Removed;
        }
        catch (Exception ex)
        {
            Log.Error(ex.Message);
            return RemoveResult.SomethingWentWrong;
        }
    }

    private RemoveResult RemoveFile(User user, Guid id) =>
        RemoveFile(user.Id, id);

    private RemoveResult RemoveFile(Guid userId, Guid id)
    {
        var file = _files.GetById(id);

        if (file is null)
            return RemoveResult.NoSuchObject;

        if (file.OwnerId != userId)
            return RemoveResult.DoesntBelong;

        try
        {
            _files.Delete(id);
            _ = Task.Run(() => EraseFromDisk(file.Location));
            return RemoveResult.Removed;
        }
        catch (Exception ex)
        {
            Log.Error(ex.Message);
            return RemoveResult.SomethingWentWrong;
        }
    }

    private void EraseFromDisk(string location) =>
        System.IO.File.Delete(location);

    private async Task<string> WriteToDisk(IFormFile file)
    {
        var path = Environment.CurrentDirectory;

        if (file?.Length is null or 0)
            return null;

        try
        {
            string filePath = Path.Combine(path, file.FileName);
            using var fs = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(fs);
            return filePath;
        }
        catch (Exception ex)
        {
            Log.Error(ex.Message);
            return null;
        }
    }

    public async Task<FileResultModel> GetFile(User user, string fileId)
    {
        var file = _files.GetById(Guid.Parse(fileId));

        if (file is null) return new(FileResult.NotFound, null, null);

        if (file.OwnerId != user.Id) return new(FileResult.DoesntBelong, null, null);

        var content = await ReadFromDisk(file);

        if (content is null) return new(FileResult.NotFound, null, null);

        return new(FileResult.Ok, content, file);
    }

    private async Task<string> ReadFromDisk(Entities.File file)
    {
        try
        {
            var bytes = await System.IO.File.ReadAllBytesAsync(file.Location);
            return Convert.ToBase64String(bytes);
        }
        catch (Exception ex)
        {
            Log.Error(ex.Message);
            return null;
        }
    }

    public FileResult Rename(User user, RenameObjectRequestModel request) =>
        request.EntityType switch
        {
            "file" => RenameFile(user, request),
            "folder" => RenameFolder(user, request),
            _ => FileResult.NotFound
        };

    private FileResult RenameFile(User user, RenameObjectRequestModel request)
    {
        var file = _files.GetById(request.ItemId);

        if (file is null) return FileResult.NotFound;

        if (file.OwnerId != user.Id) return FileResult.DoesntBelong;

        file.Name = request.Name;

        var result = _files.Update(file.Id, file);

        if (result is null) return FileResult.NotFound;

        return FileResult.Ok;
    }

    private FileResult RenameFolder(User user, RenameObjectRequestModel request)
    {
        var folder = _folders.GetById(request.ItemId);

        if (folder is null) return FileResult.NotFound;

        if (folder.OwnerId != user.Id) return FileResult.DoesntBelong;

        folder.Name = request.Name;

        var result = _folders.Update(folder.Id, folder);

        if (result is null) return FileResult.NotFound;

        return FileResult.Ok;
    }
}