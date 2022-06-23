using System.ComponentModel.DataAnnotations;

namespace Tuchka.Entities;

public class File : Entity
{
    public string Location { get; set; }
    public string Hash { get; set; }
    public decimal Size { get; set; }

    [MaxLength(250)]
    public string Name { get; set; }
    public Guid TypeId { get; set; }
    public Guid OwnerId { get; set; }
    public Guid FolderId { get; set; }

    public User Owner { get; set; }
    public Folder Folder { get; set; }
    public FileType Type { get; set; }
}