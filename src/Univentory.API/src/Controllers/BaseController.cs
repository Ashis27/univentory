using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Univentory.API.Controllers
{
    public class BaseController : ControllerBase
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public BaseController(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        public int GetUserId()
        {
            var value =  this._httpContextAccessor?.HttpContext?.User?.FindAll("sub")?.FirstOrDefault()?.Value;
            if (!String.IsNullOrWhiteSpace(value))
            {
                return int.Parse(value);
            }

            return 0;
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        public string GetUserName()
        {
            return this._httpContextAccessor.HttpContext.User.FindAll("user_name").FirstOrDefault().Value;
        }
    }
}