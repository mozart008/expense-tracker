using ExpenseTracker.Core.Interfaces;
using ExpenseTracker.Core.Services;
using ExpenseTracker.Core.Services.TransactionService;
using ExpenseTracker.Persistence;
using ExpenseTracker.Persistence.Context;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Swagger/OpenAPI setup (Essential for testing)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<ITransactionRepository, TransactionRepository>();
builder.Services.AddScoped<ITransactionService, TransactionService>();


//Add database connection
//using In memory for now
var keepAliveConnection = new SqliteConnection("DataSource=:memory:");
keepAliveConnection.Open();
builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlite(keepAliveConnection));

var app = builder.Build();

// Create the schema for in-memory database
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    db.Database.EnsureCreated(); // This creates the tables based on your models
}

// Configure the HTTP request pipeline.

// Enable Swagger in Development mode
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();