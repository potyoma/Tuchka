using System.ComponentModel.DataAnnotations;

namespace Tuchka.ViewModels.Files;

public class CreateFolderRequest
{
    [MaxLength(100)]
    public string Name { get; set; }

    public Guid? ColorId { get; set; }
    
    [Required]
    public Guid ParentId { get; set; }
}