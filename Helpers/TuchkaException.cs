namespace Tuchka.Helpers;

using System.Globalization;

// custom exception class for throwing application specific exceptions (e.g. for validation) 
// that can be caught and handled within the application
public class TuchkaException : Exception
{
    public TuchkaException() : base() {}

    public TuchkaException(string message) : base(message) { }

    public TuchkaException(string message, params object[] args) 
        : base(String.Format(CultureInfo.CurrentCulture, message, args))
    {
    }
}