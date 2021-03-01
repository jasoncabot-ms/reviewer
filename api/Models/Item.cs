using System;
using System.Collections.Generic;

namespace Reviewer.API.Models
{
    public class Item
    {
        public Item()
        {
            this.Reviews = new HashSet<Review>();
        }
        public int Id { get; set; }
        public String Name { get; set; }
        public String Description { get; set; }
        public String ImageURI { get; set; }
        public virtual ICollection<Review> Reviews { get; set; }

    }
}
