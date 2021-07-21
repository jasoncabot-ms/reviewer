using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Reviewer.API.Models;

namespace Reviewer.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly ReviewerContext _context;

        public ReviewsController(ReviewerContext context)
        {
            _context = context;
        }

        // GET: api/Reviews
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Review>>> GetReviews()
        {
            String oid = User.Claims.Where(claim => claim.Type == ClaimTypes.NameIdentifier).FirstOrDefault().Value;
            String tid = User.Claims.Where(claim => claim.Type == "http://schemas.microsoft.com/identity/claims/tenantid").FirstOrDefault().Value;
            return await _context.Reviews
                .Where(r => r.CreatedById == oid && r.CreatedByTenantId == tid)
                .Include(r => r.Item).ToListAsync();
        }

        // POST: api/Reviews
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Review>> PostReview(ReviewForm form)
        {
            var review = new Review()
            {
                CreatedBy = User.Identity.Name,
                CreatedById = User.Claims.Where(claim => claim.Type == ClaimTypes.NameIdentifier).FirstOrDefault().Value,
                CreatedByTenantId = User.Claims.Where(claim => claim.Type == "http://schemas.microsoft.com/identity/claims/tenantid").FirstOrDefault().Value,
                Text = form.Text,
                Rating = form.Rating,
                Item = _context.Items.Find(form.ItemId)
            };
            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetItem", "Items", new { id = form.ItemId }, review);
        }
    }
}
