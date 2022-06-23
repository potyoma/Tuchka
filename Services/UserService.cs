namespace Tuchka.Services;

using BCrypt.Net;
using Microsoft.Extensions.Options;
using Tuchka.Authorization;
using Tuchka.Entities;
using Tuchka.Helpers;
using Tuchka.Repository.Repositories;
using Tuchka.ViewModels.Users;

public interface IUserService
{
    AuthenticateResponse Authenticate(AuthenticateRequest model, string ipAddress);
    AuthenticateResponse RefreshToken(string token, string ipAddress);
    void RevokeToken(string token, string ipAddress);
    User GetById(Guid id);
    List<User> GetAll();
    bool Register(RegisterRequest model);
    // User GetByRefreshtoken(RefreshToken token);
}

public class UserService : IUserService
{
    private readonly IUsersRepository _users;
    private readonly IStorageService _storage;
    private readonly IJwtUtils _jwtUtils;
    private readonly AppSettings _appSettings;

    public UserService(
        IUsersRepository usersRepository,
        IStorageService storageService,
        IJwtUtils jwtUtils,
        IOptions<AppSettings> appSettings)
    {
        _users = usersRepository;
        _storage = storageService;
        _jwtUtils = jwtUtils;
        _appSettings = appSettings.Value;
    }

    public AuthenticateResponse Authenticate(AuthenticateRequest model, string ipAddress)
    {
        var user = _users.GetByUsername(model.Username);

        // validate
        if (user == null || !BCrypt.Verify(model.Password, user.PasswordHash))
            throw new TuchkaException("Username or password is incorrect");

        // authentication successful so generate jwt and refresh tokens
        var jwtToken = _jwtUtils.GenerateJwtToken(user);
        var refreshToken = _jwtUtils.GenerateRefreshToken(ipAddress);
        (user.RefreshTokens ??= new()).Add(refreshToken);

        // remove old refresh tokens from user
        RemoveOldRefreshTokens(user);

        // save changes to db
        var updated = _users.Update(user.Id, user);

        return new AuthenticateResponse(updated, jwtToken, refreshToken.Token);
    }

    public AuthenticateResponse RefreshToken(string token, string ipAddress)
    {
        var user = _users.GetUserByRefreshToken(token);
        var refreshToken = user.RefreshTokens.Single(x => x.Token == token);

        if (refreshToken.IsRevoked)
        {
            // revoke all descendant tokens in case this token has been compromised
            RevokeDescendantRefreshTokens(refreshToken, user, ipAddress, $"Attempted reuse of revoked ancestor token: {token}");
            _ = _users.Update(user.Id, user);
        }

        if (!refreshToken.IsActive)
            throw new TuchkaException("Invalid token");

        // replace old refresh token with a new one (rotate token)
        var newRefreshToken = RotateRefreshToken(refreshToken, ipAddress);
        user.RefreshTokens.Add(newRefreshToken);

        // remove old refresh tokens from user
        RemoveOldRefreshTokens(user);

        var updated = _users.Update(user.Id, user);

        // generate new jwt
        var jwtToken = _jwtUtils.GenerateJwtToken(user);

        return new AuthenticateResponse(updated, jwtToken, newRefreshToken.Token);
    }

    public void RevokeToken(string token, string ipAddress)
    {
        var user = _users.GetUserByRefreshToken(token);
        var refreshToken = user.RefreshTokens.Single(x => x.Token == token);

        if (!refreshToken.IsActive)
            throw new TuchkaException("Invalid token");

        // revoke token and save
        RevokeRefreshToken(refreshToken, ipAddress, "Revoked without replacement");
        _ = _users.Update(user.Id, user);
    }

    private RefreshToken RotateRefreshToken(RefreshToken refreshToken, string ipAddress)
    {
        var newRefreshToken = _jwtUtils.GenerateRefreshToken(ipAddress);
        RevokeRefreshToken(refreshToken, ipAddress, "Replaced by new token", newRefreshToken.Token);
        return newRefreshToken;
    }

    private void RemoveOldRefreshTokens(User user) =>
        user.RefreshTokens.RemoveAll(x =>
            !x.IsActive &&
            x.Created.AddDays(_appSettings.RefreshTokenTtl) <= DateTime.UtcNow);

    private void RevokeDescendantRefreshTokens(RefreshToken refreshToken, User user, string ipAddress, string reason)
    {
        if (string.IsNullOrWhiteSpace(refreshToken.ReplacedByToken))
            return;

        var childToken = user.RefreshTokens.SingleOrDefault(x => x.Token == refreshToken.ReplacedByToken);
        if (childToken.IsActive)
            RevokeRefreshToken(childToken, ipAddress, reason);
        else
            RevokeDescendantRefreshTokens(childToken, user, ipAddress, reason);
    }

    private void RevokeRefreshToken(RefreshToken token, string ipAddress, string reason = null, string replacedByToken = null)
    {
        token.Revoked = DateTime.UtcNow;
        token.RevokedByIp = ipAddress;
        token.ReasonRevoked = reason;
        token.ReplacedByToken = replacedByToken;
    }

    public User GetById(Guid id) =>
        _users.GetById(id);

    public List<User> GetAll() =>
        _users.GetAll();

    public bool Register(RegisterRequest model)
    {
        if (model is null ||
            !_users.IsUniqueUsername(model.Username) ||
            model.Password.Trim() != model.ConfirmPassword.Trim())
            return false;

        var user = new User
        {
            Email = model.Email,
            PhoneNumber = model.PhoneNumber,
            Username = model.Username
        };

        user.PasswordHash = BCrypt.HashPassword(model.Password);
        var result = _users.Add(user);

        _ = _storage.InitMainFolder(result.Id);

        return result is not null;
    }
}