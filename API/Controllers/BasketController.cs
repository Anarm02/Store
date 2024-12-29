using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class BasketController:BaseApiController
    {
        private readonly AppDbContext _appDbContext;
        public BasketController(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
            
        }
        [HttpGet(Name ="GetBasket")]
        public async Task<IActionResult> GetBasket()
        {
            Basket basket = await RetrieveBasket();
            if (basket == null) return NotFound();
            BasketDto basketDto = GetBasketDto(basket);
            return Ok(basketDto);
        }

        

        [HttpPost]
        public async Task<IActionResult> AddBasket(int productId, int quantity){
var basket =await RetrieveBasket();
if(basket==null) basket=await CreateBasket();
Product product=await _appDbContext.Products.FirstOrDefaultAsync(x=>x.Id==productId);
if(product==null) return NotFound();
basket.AddItem(product,quantity);
var result=await _appDbContext.SaveChangesAsync()>0;
if(result) return CreatedAtRoute("GetBasket",GetBasketDto(basket));
return BadRequest(new ProblemDetails(){Title="There is problem at saving product in basket"});
        }
        [HttpDelete]
        public async Task<IActionResult> RemoveBasket(int productId,int quantity){
            Basket basket=await RetrieveBasket();
            basket.RemoveItem(productId,quantity);
            var result=await _appDbContext.SaveChangesAsync()>0;
            if(result) return Ok("Item deleted");
            return BadRequest(new ProblemDetails(){Title="There is problem at removing item from basket"});
        }

        private async Task<Basket> CreateBasket()
        {
            var buyerId=Guid.NewGuid().ToString();
            var cookieOptions=new CookieOptions(){IsEssential=true,Expires=DateTime.Now.AddDays(30)};
            Response.Cookies.Append("buyerId",buyerId,cookieOptions);
            Basket basket=new(){BuyerId=buyerId};
            await _appDbContext.Baskets.AddAsync(basket);
            return basket;
        }
private  BasketDto GetBasketDto(Basket basket)
        {
            return new()
            {
                BuyerId = basket.BuyerId,
                Items = basket.Items.Select(i => new BasketItemDto()
                {
                    Brand = i.Product.Brand,
                    ImageUrl = i.Product.ImageUrl,
                    ProductId = i.ProductId,
                    Name = i.Product.Name,
                    Price = i.Product.Price,
                    Quantity = i.Quantity,
                    Type = i.Product.Type
                }).ToList(),
                Id = basket.Id
            };
        }
        private async Task<Basket> RetrieveBasket(){
          return  await _appDbContext.Baskets
            .Include(i=>i.Items)
            .ThenInclude(p=>p.Product)
            .FirstOrDefaultAsync(x=>x.BuyerId==Request.Cookies["buyerId"]);
        }
    }
}