using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace Tuchka.Entities;

public class Folder : Entity
{
    [MaxLength(100)]
    public string Name { get; set; }
    public Guid ColorId { get; set; }    
    public Guid? ParentId { get; set; }
    public Guid OwnerId { get; set; }

    public Folder Parent { get; set; }
    public User Owner { get; set; }
    public Color Color { get; set; }
}