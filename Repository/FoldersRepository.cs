using Microsoft.EntityFrameworkCore;
using Tuchka.Entities;
using Tuchka.Repository.Repositories;

namespace Tuchka.Repository;

public interface IFoldersRepository : IRepositoryBase<Folder>
{
    Folder GetMainFolder(Guid userId);
    List<Folder> GetFoldersByParent(Guid parentFolderId);
}

public class FoldersRepository : RepositoryBase<Folder>, IFoldersRepository
{
    public FoldersRepository(TuchkaDbContext context)
        : base(context) { }

    public List<Folder> GetFoldersByParent(Guid parentFolderId) =>
        _context.Folders
            .Where(f => f.ParentId == parentFolderId)
            .Include(f => f.Color)
            .ToList();

    public Folder GetMainFolder(Guid userId) => 
        _context.Folders
            .Include(f => f.Color)
            .FirstOrDefault(f => f.OwnerId == userId && f.ParentId == null);
}