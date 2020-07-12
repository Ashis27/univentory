using System;
using System.Collections.Generic;
using System.Text;

namespace Univentory.Services.Helpers
{
    public static class Role
    {
        public const string Admin = "admin";
        public const string SuperAdmin = "superadmin";
        public const string User = "user";

        public static bool Validate(string role)
        {
            if (string.IsNullOrWhiteSpace(role))
            {
                return false;
            }
            role = role.ToLowerInvariant();

            return role == User || role == Admin || role == SuperAdmin;
        }
    }
}
