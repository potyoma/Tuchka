using Tuchka.Entities;

namespace Tuchka.Repository.Repositories;

public interface IUsersRepository : IRepositoryBase<User>
{
    User GetByUsername(string username);
    User GetUserByRefreshToken(string token);
    bool IsUniqueToken(string token);
    bool IsUniqueUsername(string username);
}

public class UsersRepository : RepositoryBase<User>, IUsersRepository
{
    public UsersRepository(TuchkaDbContext context)
        : base(context) { }

    public User GetByUsername(string username) =>
        _context.Users.FirstOrDefault(u => u.Username == username);

    public User GetUserByRefreshToken(string token) =>
        _context.Users.FirstOrDefault(u => u.RefreshTokens.Any(t => t.Token == token));

    public bool IsUniqueToken(string token) =>
        _context.Users.Any(u => u.RefreshTokens.Any(t => t.Token == token));

    public bool IsUniqueUsername(string username) =>
        _context.Users.All(u => u.Username != username);
}