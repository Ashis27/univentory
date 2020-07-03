using System;
using System.Collections.Generic;
using System.Text;

namespace Univentory.Services.Helpers
{
    public sealed class Token
    {
        public int Id { get; }

        public string UserName { get; }

        public string AuthToken { get; }

        public string RefreshToken { get; }

        public int ExpiresIn { get; }

        public string shopName { get; set; }

        public string MobileNumber { get; set; }

        public string Address { get; set; }

        public string GSTNumber { get; set; }

        public Token(int id,string userName, string authToken, int expiresIn, string refreshToken)
        {
            Id = id;
            UserName = userName;
            AuthToken = authToken;
            RefreshToken = refreshToken;
            ExpiresIn = expiresIn;
        }
    }
}
