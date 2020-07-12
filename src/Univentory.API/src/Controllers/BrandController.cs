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
    [Route("api/brand")]
    [ApiController]
    public class BrandController : BaseController
    {
        private readonly IBrandService _brandService;
        private readonly int _userId;

        public BrandController(IHttpContextAccessor httpContextAccessor, IBrandService brandService) : base(httpContextAccessor)
        {
            _brandService = brandService;
            _userId = this.GetUserId();
        }

        [HttpPost("create")]
        [ProducesResponseType(typeof(BrandViewModel),(int)HttpStatusCode.OK)]
        public async Task<ActionResult<BrandViewModel>> AddBrandItem(BrandViewModel model)
        {
            model.UserId = _userId;
            var brand = await _brandService.AddBrand(model);

            return Ok(brand);
        }

        [HttpGet("item/{id}")]
        [ProducesResponseType(typeof(BrandViewModel), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<BrandViewModel>> GetBrandItem(int id)
        {
            var brand = await _brandService.GetBrandById(id);

            return Ok(brand);
        }

        [HttpGet("items")]
        [ProducesResponseType(typeof(PaginatedResultBase<BrandViewModel>), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<PaginatedResultBase<BrandViewModel>>> GetBrandTypes([FromQuery]int pageIndex, [FromQuery]int pageSize)
        {
            var brands = await _brandService.GetBrandTypes(_userId, pageIndex, pageSize);

            return Ok(brands);
        }

        [HttpGet("searchitems")]
        [ProducesResponseType(typeof(PaginatedResultBase<BrandViewModel>), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<PaginatedResultBase<BrandViewModel>>> GetSearchBrandTypes([FromQuery]string searchKeyword, [FromQuery]int pageIndex, [FromQuery]int pageSize)
        {
            var brands = await _brandService.GetSearchBrandTypes(_userId, searchKeyword, pageIndex,pageSize);

            return Ok(brands);
        }
    }
}