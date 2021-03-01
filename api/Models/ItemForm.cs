using Microsoft.AspNetCore.Http;

namespace Reviewer.API.Models
{
    public class ItemForm
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public IFormFile Image { get; set; }
    }
}