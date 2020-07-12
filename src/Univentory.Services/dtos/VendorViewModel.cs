using System;
using System.Collections.Generic;
using System.Text;

namespace Univentory.Services.dtos
{
    public class VendorViewModel
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public string Name { get; set; }

        public string Email { get; set; }

        public string MobileNumber { get; set; }

        public string BillingAddress { get; set; }
    }
}
