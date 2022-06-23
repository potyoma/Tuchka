using Tuchka.Entities;

namespace Tuchka.Repository.Repositories;

public interface IRepositoryBase<TEntity> where TEntity : Entity
{
    TEntity GetById(Guid id);
    List<TEntity> GetAll();
    void Delete(Guid id);
    TEntity Add(TEntity model);
    TEntity Update(Guid id, TEntity model);
}

public class RepositoryBase<TEntity> : IRepositoryBase<TEntity> where TEntity : Entity
{
    protected readonly TuchkaDbContext _context;

    public RepositoryBase(TuchkaDbContext context)
    {
        _context = context;
    }

    public TEntity Add(TEntity model)
    {
        var result = _context.Add(model);
        _context.SaveChanges();
        return result.Entity;
    }

    public void Delete(Guid id)
    {
        var existing = GetById(id);

        if (existing is null) return;

        _context.Remove(existing);
        _context.SaveChanges();
    }

    public List<TEntity> GetAll() =>
        _context.Set<TEntity>().ToList();

    public TEntity GetById(Guid id) =>
        _context.Set<TEntity>().FirstOrDefault(e => e.Id == id);

    public TEntity Update(Guid id, TEntity model)
    {
        var existing = GetById(id);

        if (existing is null) return null;

        model.Id = id;
        var result = _context.Update(model);
        _context.SaveChanges();
        return result.Entity;
    }
}