using System.Text.Json.Serialization;
using Tuchka.Entities;
using File = Tuchka.Entities.File;

namespace Tuchka.ViewModels.Files;

public class StorageTree
{
    public Folder CurrentFolder { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public List<Folder> Folders { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public List<File> Files { get; set; }
}
