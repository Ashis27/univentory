using System;
using System.Collections.Generic;
using System.Text;

namespace Univentory.Services.dtos
{
    public class BrandViewModel
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }
    }
}
