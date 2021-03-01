using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Reviewer.API.Models
{
    public class Review
    {
        public int Id { get; set; }
        public String Text { get; set; }
        public String CreatedBy { get; set; }
        public int Rating { get; set; }
        [ForeignKey("ItemId")]
        [JsonIgnore]
        public virtual Item Item { get; set; }
    }
}
