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
    [Route("api/product")]
    [ApiController]
    public class ProductController : BaseController
    {
        private readonly IProductService _productService;
        private readonly int _userId;

        public ProductController(IHttpContextAccessor httpContextAccessor, IProductService productService) : base(httpContextAccessor)
        {
            _productService = productService;
            _userId = this.GetUserId();
        }

        [HttpPost("create")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public async Task<IActionResult> AddProductItem(ProductViewModel model)
        {
            model.UserId = _userId;
            await _productService.AddProductItem(model);

            return Ok();
        }

        [HttpGet("item/{id}")]
        [ProducesResponseType(typeof(ProductViewModel),(int)HttpStatusCode.OK)]
        public async Task<ActionResult<ProductViewModel>> GetProductItem(int id)
        {
            var product = await _productService.GetProductItem(id);

            return Ok(product);
        }

        [HttpPost("items")]
        [ProducesResponseType(typeof(PaginatedResultBase<ProductViewModel>), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<PaginatedResultBase<ProductViewModel>>> GetSearchProductItems(SearchViewModel model)
        {
            model.UserId = _userId;
            var product = await _productService.GetSearchProductItems(model);

            return Ok(product);
        }

        [HttpGet("items/vendorProductHistory/{vendorId}")]
        [ProducesResponseType(typeof(PaginatedResultBase<ProductViewModel>), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<PaginatedResultBase<ProductViewModel>>> GetProductItemsByVendorId(int vendorId, [FromQuery]int pageIndex, [FromQuery]int pageSize, [FromQuery]bool isActive)
        {
            var product = await _productService.GetProductItemsByVendorId(_userId,vendorId,pageIndex,pageSize,isActive);

            return Ok(product);
        }

        [HttpDelete("items/{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public async Task<ActionResult<IEnumerable<ProductViewModel>>> DeleteProduct(int id)
        {
            await _productService.DeleteProduct(id);

            return Ok();
        }

        [HttpPut("update")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public async Task<IActionResult> UpdateProductItem(ProductViewModel model)
        {
            model.UserId = _userId;
            await _productService.UpdateProduct(model);

            return Ok();
        }
    }
}