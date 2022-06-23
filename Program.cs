using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Tuchka.Authorization;
using Tuchka.Helpers;
using Tuchka.Repository;
using Tuchka.Repository.Repositories;
using Tuchka.Services;

var builder = WebApplication.CreateBuilder(args);

var services = builder.Services;

services.AddDbContext<TuchkaDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

services.AddCors();

// Add services to the container.

services
    .AddControllersWithViews()
    .AddJsonOptions(opt =>
        opt.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull);

services.Configure<AppSettings>(builder.Configuration.GetSection("AppSettings"));

services.AddTransient<IFilesRepository, FilesRepository>();
services.AddTransient<IFoldersRepository, FoldersRepository>();
services.AddTransient<IUsersRepository, UsersRepository>();

services.AddScoped<IJwtUtils, JwtUtils>();
services.AddScoped<IStorageService, StorageService>();
services.AddScoped<IUserService, UserService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseCors(opt => opt
    .SetIsOriginAllowed(origin => true)
    .AllowAnyMethod()
    .AllowAnyHeader()
    .AllowCredentials());

app.UseMiddleware<ErrorHandlerMiddleware>();
app.UseMiddleware<JwtMiddleware>();

app.UseStaticFiles();
app.UseRouting();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.Run();
