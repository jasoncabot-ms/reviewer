using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Azure.Identity;
using Azure.Storage.Blobs;
using Azure.Storage.Sas;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Reviewer.API.Models;

namespace Reviewer.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemsController : ControllerBase
    {
        private readonly ReviewerContext _context;
        private readonly BlobServiceClient _blobServiceClient;

        public ItemsController(ReviewerContext context, BlobServiceClient blobServiceClient)
        {
            _context = context;
            _blobServiceClient = blobServiceClient;
        }

        // GET: api/Items
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Item>>> GetItems()
        {
            return await _context.Items.Include(item => item.Reviews).ToListAsync();
        }

        // GET: api/Items/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Item>> GetItem(int id)
        {
            var item = await _context
                .Items
                .Include(item => item.Reviews)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (item == default(Item))
            {
                return NotFound();
            }

            return item;
        }

        // POST: api/Items
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Item>> PostItem([FromForm] ItemForm form)
        {
            // Connect to Azure Blob Storage
            var containerClient = this._blobServiceClient.GetBlobContainerClient("images");
            BlobClient blob = containerClient.GetBlobClient(Guid.NewGuid().ToString());

            // Upload the file that the user just submitted
            await blob.UploadAsync(form.Image.OpenReadStream());

            // Generate a Public URI for it
            // In theory we shouldn't need this and just use Azure Front Door with Access to Private Endpoint
            var userDelegationKey = await this._blobServiceClient
                .GetUserDelegationKeyAsync(DateTimeOffset.UtcNow, DateTimeOffset.UtcNow.AddDays(7));
            var sasBuilder = new BlobSasBuilder()
            {
                BlobContainerName = blob.BlobContainerName,
                BlobName = blob.Name,
                Resource = "b",
                StartsOn = DateTimeOffset.UtcNow,
                ExpiresOn = DateTimeOffset.UtcNow.AddDays(7),
            };
            sasBuilder.SetPermissions(BlobSasPermissions.Read);
            var blobUriBuilder = new BlobUriBuilder(blob.Uri)
            {
                Sas = sasBuilder.ToSasQueryParameters(userDelegationKey, this._blobServiceClient.AccountName)
            };
            var sasUri = blobUriBuilder.ToUri();

            // Save our Item with the data + image uri
            var item = new Item
            {
                Name = form.Name,
                Description = form.Description,
                ImageURI = sasUri.AbsoluteUri
            };
            _context.Items.Add(item);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetItem", new { id = item.Id }, item);
        }

        private bool ItemExists(int id)
        {
            return _context.Items.Any(e => e.Id == id);
        }
    }
}
