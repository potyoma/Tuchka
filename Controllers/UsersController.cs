namespace Tuchka.Controllers;

using Microsoft.AspNetCore.Mvc;
using Tuchka.Authorization;
using Tuchka.ViewModels.Users;
using Tuchka.Services;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [AllowAnonymous]
    [HttpPost("authenticate")]
    public IActionResult Authenticate(AuthenticateRequest model)
    {
        var response = _userService.Authenticate(model, IpAddress());
        SetTokenCookie(response.RefreshToken);
        return Ok(response);
    }

    [AllowAnonymous]
    [HttpPost("refresh-token")]
    public IActionResult RefreshToken()
    {
        var refreshToken = Request.Cookies["refreshToken"];
        var response = _userService.RefreshToken(refreshToken, IpAddress());
        SetTokenCookie(response.RefreshToken);
        return Ok(response);
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public IActionResult Register(RegisterRequest model)
    {
        var isSuccess = _userService.Register(model);
        return isSuccess ? Ok() : BadRequest();
    }

    [HttpPost("revoke-token")]
    public IActionResult RevokeToken(RevokeTokenRequest model)
    {
        // accept refresh token in request body or cookie
        var token = model.Token ?? Request.Cookies["refreshToken"];

        if (string.IsNullOrEmpty(token))
            return BadRequest(new { message = "Token is required" });

        _userService.RevokeToken(token, IpAddress());
        return Ok(new { message = "Token revoked" });
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var users = _userService.GetAll();
        return Ok(users);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(Guid id)
    {
        var user = _userService.GetById(id);
        return Ok(user);
    }

    [HttpGet("{id}/refresh-tokens")]
    public IActionResult GetRefreshTokens(Guid id)
    {
        var user = _userService.GetById(id);
        return Ok(user.RefreshTokens);
    }

    // helper methods

    private void SetTokenCookie(string token)
    {
        // append cookie with refresh token to the http response
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Expires = DateTime.UtcNow.AddDays(7)
        };
        Response.Cookies.Append("refreshToken", token, cookieOptions);
    }

    private string IpAddress()
    {
        // get source ip address for the current request
        if (Request.Headers.ContainsKey("X-Forwarded-For"))
            return Request.Headers["X-Forwarded-For"];
        else
            return HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();
    }
}