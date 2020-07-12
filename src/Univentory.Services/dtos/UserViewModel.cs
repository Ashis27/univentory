using System;
using System.Collections.Generic;
using System.Text;

namespace Univentory.Services.dtos
{
    public class UserViewModel
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string GSTNumber { get; set; }

        public string UserName { get; set; }

        public string PasswordHash { get; set; }

        public string MobileNumber { get; set; }

        public string Email { get; set; }

        public string ShopName { get; set; }

        public string Logo { get; set; }

        public string Address { get; set; }
    }
}
