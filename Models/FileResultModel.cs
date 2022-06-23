namespace Tuchka.Models;

public record FileResultModel(FileResult Result, string FileBase64, Entities.File FileData);

public enum FileResult
{
    Ok,
    NotFound,
    DoesntBelong
}