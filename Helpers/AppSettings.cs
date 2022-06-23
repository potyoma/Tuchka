namespace Tuchka.Helpers;

public class AppSettings
{
    public string Secret { get; set; }
    
    // Time to live
    public int RefreshTokenTtl { get; set; }
}