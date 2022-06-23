using Microsoft.AspNetCore.Mvc;
using Tuchka.Authorization;
using Tuchka.Entities;
using Tuchka.Models.Enums;
using Tuchka.Services;
using Tuchka.ViewModels;
using Tuchka.ViewModels.Files;

namespace Tuchka.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FilesController : ControllerBase
{
    private readonly IStorageService _storage;

    private string ErrMessage => "Something went wrong...";

    public FilesController(IStorageService storageService)
    {
        _storage = storageService;
    }

    [HttpGet]
    [Authorize]
    public IActionResult GetAll([FromQuery] Guid? folderId = null)
    {
        var user = (User)HttpContext.Items["User"];
        var files = _storage.GetStorageTree(user.Id, folderId);
        return files is null ? NotFound() : Ok(files);
    }

    [HttpPost]
    [Authorize]
    public IActionResult AddFolder([FromBody] CreateFolderRequest model)
    {
        var user = (User)HttpContext.Items["User"];
        var created = _storage.AddFolder(user.Id, model);
        return created is null ? BadRequest(ErrMessage) : Ok(created);
    }

    [HttpPost("{folderId}")]
    [Authorize]
    public async Task<IActionResult> UploadFile([FromForm] IFormFile file, [FromRoute] Guid folderId)
    {
        var user = (User)HttpContext.Items["User"];
        var uploaded = await _storage.Upload(user, folderId, file);
        return uploaded ? Ok() : BadRequest(ErrMessage);
    }

    [HttpDelete]
    [Authorize]
    public IActionResult Remove([FromQuery] string entity, Guid id)
    {
        var user = (User)HttpContext.Items["User"];
        var removed = _storage.Remove(user, entity, id);
        return removed switch
        {
            RemoveResult.DoesntBelong => Unauthorized("It does not belong to you."),
            RemoveResult.NoSuchObject => NotFound("Such object was not found."),
            RemoveResult.NoSuchType => NotFound("No such object type."),
            RemoveResult.Removed => Ok(),
            _ => BadRequest("Something went wrong...")
        };
    }

    [HttpGet("{fileId}")]
    [Authorize]
    public async Task<IActionResult> GetFile(string fileId)
    {
        var user = (User)HttpContext.Items["User"];
        var result = await _storage.GetFile(user, fileId);

        return result.Result switch
        {
            Models.FileResult.Ok => Ok(result),
            Models.FileResult.DoesntBelong => Unauthorized("Oops. The file does not seem to belong to you."),
            _ => NotFound("Could not find such file.")
        };
    }

    [HttpPatch]
    [Authorize]
    public IActionResult RenameObject([FromBody] RenameObjectRequestModel request)
    {
        var user = (User)HttpContext.Items["User"];
        Models.FileResult result = _storage.Rename(user, request);

        return result switch
        {
            Models.FileResult.Ok => Ok(),
            Models.FileResult.DoesntBelong => Unauthorized("Oops... It doesnt belong to you."),
            _ => NotFound("No such item.")
        };
    }
}