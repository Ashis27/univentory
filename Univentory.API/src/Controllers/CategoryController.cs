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
    [Route("api/category")]
    [ApiController]
    public class CategoryController : BaseController
    {
        private readonly ICategoryService _categoryService;
        private readonly int _userId;

        public CategoryController(IHttpContextAccessor httpContextAccessor, ICategoryService categoryService) : base(httpContextAccessor)
        {
            _categoryService = categoryService;
            _userId = this.GetUserId();
        }

        [HttpPost("create")]
        [ProducesResponseType(typeof(CategoryViewModel),(int)HttpStatusCode.OK)]
        public async Task<ActionResult<CategoryViewModel>> AddCategoryItem(CategoryViewModel model)
        {
            model.UserId = _userId;
            var category = await _categoryService.AddCategory(model);

            return Ok(category);
        }

        [HttpGet("item/{id}")]
        [ProducesResponseType(typeof(CategoryViewModel), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<CategoryViewModel>> GetCategoryItem(int id)
        {
            var category = await _categoryService.GetCategoryById(id);

            return Ok(category);
        }

        [HttpGet("items")]
        [ProducesResponseType(typeof(PaginatedResultBase<CategoryViewModel>), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<PaginatedResultBase<CategoryViewModel>>> GetCategoryTypes([FromQuery]int pageIndex, [FromQuery]int pageSize)
        {
            var categories = await _categoryService.GetCategoryTypes(_userId,pageIndex,pageSize);

            return Ok(categories);
        }

        [HttpGet("searchitems")]
        [ProducesResponseType(typeof(PaginatedResultBase<CategoryViewModel>), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<PaginatedResultBase<CategoryViewModel>>> GetSearchCategoryTypes([FromQuery]string searchKeyword, [FromQuery]int pageIndex, [FromQuery]int pageSize)
        {
            var categories = await _categoryService.GetSearchCategoryTypes(_userId, searchKeyword, pageIndex, pageSize);

            return Ok(categories);
        }
    }
}