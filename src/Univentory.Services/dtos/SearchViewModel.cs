using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace Univentory.Services.dtos
{
    public class SearchViewModel
    {
        public int UserId { get; set; }

        public int Id { get; set; }

        public bool IsActive { get; set; }

        public int PageIndex { get; set; }

        public int PageSize { get; set; }

        public string Keyword { get; set; }

        public string Name { get; set; }

        public string Code { get; set; }
    }
}
