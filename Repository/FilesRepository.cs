using Microsoft.EntityFrameworkCore;
using Tuchka.Repository.Repositories;

namespace Tuchka.Repository;

public interface IFilesRepository : IRepositoryBase<Tuchka.Entities.File>
{
    List<Tuchka.Entities.File> GetByFolder(Guid folderId);
}

public class FilesRepository : RepositoryBase<Tuchka.Entities.File>, IFilesRepository
{
    public FilesRepository(TuchkaDbContext context)
        : base(context) { }

    public List<Tuchka.Entities.File> GetByFolder(Guid folderId) =>
        _context.Files
            .Where(f => f.FolderId == folderId)
            .Include(f => f.Type)
            .ToList();
}