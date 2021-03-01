using Microsoft.EntityFrameworkCore;

namespace Reviewer.API.Models
{
    public class ReviewerContext : DbContext
    {
        public ReviewerContext(DbContextOptions<ReviewerContext> options)
            : base(options)
        {
            var connection = (Microsoft.Data.SqlClient.SqlConnection)Database.GetDbConnection();
            connection.AccessToken = (new Microsoft.Azure.Services.AppAuthentication.AzureServiceTokenProvider()).GetAccessTokenAsync("https://database.windows.net/").Result;
        }

        public DbSet<Item> Items { get; set; }

        public DbSet<Review> Reviews { get; set; }
    }
}