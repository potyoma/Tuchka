using System.ComponentModel.DataAnnotations;

namespace Tuchka.Entities;

public class FileType : Entity
{
    public Tuchka.Models.Enums.FileType Type { get; set; }

    [MaxLength(10)]
    public string Extension { get; set; }
}