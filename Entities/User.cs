using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Tuchka.Entities;

[Index(nameof(Username), IsUnique = true)]
public class User : Entity
{
    [MaxLength(100)]
    public string Username { get; set; }
    public string Email { get; set; }
    public int StorageVolume { get; set; }
    public string PasswordHash { get; set; }

    [MaxLength(15)]
    public string PhoneNumber { get; set; }
    public List<RefreshToken> RefreshTokens { get; set; }
}