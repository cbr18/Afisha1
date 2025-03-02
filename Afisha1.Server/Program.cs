using Afisha1.Server.Data;
using Microsoft.EntityFrameworkCore;
using DotNetEnv;

Env.Load(".env");
string connectionstring = Env.GetString("DB_CONNECTION");
Console.WriteLine(connectionstring);

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

var allowedOrigins = Env.GetString("ALLOWED_ORIGINS")!.Split(",");
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins(allowedOrigins).AllowAnyMethod().AllowAnyHeader();
                      });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AfishaDbContext>(options =>
{
    options.UseNpgsql(connectionstring);
});

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(MyAllowSpecificOrigins);

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

await app.RunAsync();
