using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Univentory.Common.helper;
using Univentory.Domain.entities;
using Univentory.Services.dtos;
using Univentory.Services.Helpers;
using Univentory.Services.interfaces;

namespace Univentory.API.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : BaseController
    {
        private readonly IUserService _userService;
        private readonly int _userId;

        public UserController(IUserService userService, IHttpContextAccessor _httpContextAccessor)
            : base(_httpContextAccessor)
        {
            _userService = userService;
            _userId = this.GetUserId();
        }

        [HttpPost("authenticate")]
        [ProducesResponseType(typeof(Token), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<Token>> LogIn(UserLoginViewModel model)
        {
            Token token = await _userService.Authenticate(model);

            return Ok(token);
        }

        [HttpGet("profile")]
        [ProducesResponseType(typeof(UserViewModel),(int)HttpStatusCode.OK)]
        public async Task<ActionResult<UserViewModel>> GetUserProfile()
        {
            var userProfile = await _userService.GetUserProfile(_userId);

            return Ok(userProfile);
        }

        [HttpPost("create/consumer")]
        [ProducesResponseType(typeof(ConsumerViewModel), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<ConsumerViewModel>> AddConsumer(ConsumerViewModel model)
        {
            model.UserId = _userId;
            var user = await _userService.AddConsumer(model);

            return Ok(user);
        }

        [HttpPut("update/user")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public async Task<IActionResult> UpdateUserProfile(UserViewModel model)
        {
            model.Id = _userId;
            await _userService.UpdateUserProfile(model);

            return Ok();
        }

        [HttpPut("update/consumer")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public async Task<IActionResult> UpdateConsumer(ConsumerViewModel model)
        {
            model.UserId = _userId;
            await _userService.UpdateConsumer(model);

            return Ok();
        }

        [HttpGet("consumer/search")]
        [ProducesResponseType(typeof(PaginatedResultBase<ConsumerViewModel>), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<PaginatedResultBase<ConsumerViewModel>>> GetSearchConsumers([FromQuery]string searchKeyword, [FromQuery]int pageIndex, [FromQuery]int pageSize)
        {
            var consumers = await _userService.GetSearchConsumers(_userId, searchKeyword, pageIndex, pageSize);

            return Ok(consumers);
        }

        [HttpPost("create/vendor")]
        [ProducesResponseType(typeof(ConsumerViewModel), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<VendorViewModel>> AddVendor(VendorViewModel model)
        {
            model.UserId = _userId;
            var user = await _userService.AddVendor(model);

            return Ok(user);
        }

        [HttpPut("update/vendor")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public async Task<IActionResult> UpdateVendor(VendorViewModel model)
        {
            model.UserId = _userId;
            await _userService.UpdateVendor(model);

            return Ok();
        }

        [HttpGet("vendor/search")]
        [ProducesResponseType(typeof(PaginatedResultBase<VendorViewModel>), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<PaginatedResultBase<VendorViewModel>>> GetSearchVendors([FromQuery]string searchKeyword, [FromQuery]int pageIndex, [FromQuery]int pageSize)
        {
            var vendors = await _userService.GetSearchVendors(_userId, searchKeyword, pageIndex, pageSize);

            return Ok(vendors);
        }

        [HttpPost("create/user")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public async Task<IActionResult> AddUser(UserViewModel model)
        {
            await _userService.AddUser(model);

            return Ok();
        }

    }
}