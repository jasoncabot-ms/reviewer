namespace Reviewer.API.Models
{
    public class ReviewForm
    {
        public int ItemId { get; set; }
        public string Text { get; set; }
        public int Rating { get; set; }
    }
}