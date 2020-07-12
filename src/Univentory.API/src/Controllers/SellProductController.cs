using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Univentory.Common.helper;
using Univentory.Services.dtos;
using Univentory.Services.interfaces;

namespace Univentory.API.Controllers
{
    [Route("api/sellproduct")]
    [ApiController]
    public class SellProductController : BaseController
    {
        private readonly IProductSellService _productSellService;
        private readonly int _userId;

        public SellProductController(IHttpContextAccessor httpContextAccessor,IProductSellService productSellService):base(httpContextAccessor)
        {
            _productSellService = productSellService;
            _userId = this.GetUserId();
        }

        [HttpPost("create")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public async Task<ActionResult<int>> AddSellProductItem(SellProductViewModel model)
        {
            model.UserId = _userId;
            int saleId = await _productSellService.SellProducts(model);

            return Ok(saleId);
        }

        [HttpGet("items")]
        [ProducesResponseType(typeof(PaginatedResultBase<SellProductViewModel>),(int)HttpStatusCode.OK)]
        public async Task<ActionResult<PaginatedResultBase<SellProductViewModel>>> GetSellProductItems([FromQuery]string searchKeyword, [FromQuery]int pageIndex, [FromQuery]int pageSize)
        {
            var sellProducts = await _productSellService.GetSellProducts(_userId, searchKeyword,pageIndex,pageSize);

            return Ok(sellProducts);
        }

        [HttpGet("items/consumerPurchaseHistory/{consumerId}")]
        [ProducesResponseType(typeof(PaginatedResultBase<SellProductViewModel>), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<PaginatedResultBase<SellProductViewModel>>> GetSellProductItemsByConsumerId(int consumerId, [FromQuery]int pageIndex, [FromQuery]int pageSize)
        {
            var sellProducts = await _productSellService.GetSellProductItemsByConsumerId(_userId, consumerId, pageIndex, pageSize);

            return Ok(sellProducts);
        }

        [HttpGet("item/{id}")]
        [ProducesResponseType(typeof(SellProductViewModel),(int)HttpStatusCode.OK)]
        public async Task<ActionResult<SellProductViewModel>> GetSellProductItem(int id)
        {
            var sellproduct = await _productSellService.GetSellProductById(id);

            return Ok(sellproduct);
        }

        [HttpGet("items/{saleId}")]
        [ProducesResponseType(typeof(PaginatedResultBase<SellProductHistoryViewModel>), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<PaginatedResultBase<SellProductHistoryViewModel>>> GetSellProductItemHistory(int saleId, [FromQuery]int pageIndex, [FromQuery]int pageSize)
        {
            var sellproductItems = await _productSellService.GetSellProductHistoryById(saleId,pageIndex,pageSize);

            return Ok(sellproductItems);
        }

        [HttpDelete("item/{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public async Task<IActionResult> DeleteSellProductItem(int id)
        {
            await _productSellService.DeleteSellProduct(id);

            return Ok();
        }
    }
}