namespace Tuchka.Authorization;

using Microsoft.Extensions.Options;
using Tuchka.Helpers;
using Tuchka.Services;

public class JwtMiddleware
{
    private readonly RequestDelegate _next;
    private readonly AppSettings _appSettings;

    public JwtMiddleware(RequestDelegate next, IOptions<AppSettings> appSettings)
    {
        _next = next;
        _appSettings = appSettings.Value;
    }

    public async Task Invoke(HttpContext context, IUserService userService, IJwtUtils jwtUtils)
    {
        var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
        var userId = jwtUtils.ValidateJwtToken(token);
        
        if (userId is not null)
            context.Items["User"] = userService.GetById(userId.Value);

        await _next(context);
    }
}