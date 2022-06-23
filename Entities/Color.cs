using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Tuchka.Entities;

public class Color : Entity
{
    public string Name { get; set; }

    [MaxLength(6)]
    public string Hex { get; set; }

    [NotMapped]
    public static Guid DefaultColorId => new Guid("53a6bff2-77f9-48dd-b74e-31f3225ac732");
}