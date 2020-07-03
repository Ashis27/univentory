using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using Univentory.Common.filters;

namespace Univentory.Domain.entities
{
    public class User: BaseEntity
    {
        public string Name { get; private set; }

        public string UserName { get; private set; }

        public string GSTNumber { get; private set; }

        public string PasswordHash { get; private set; }

        public string MobileNumber { get; set; }

        public string Email { get; private set; }

        public string ShopName { get; private set; }

        public string Logo { get; private set; }

        public string Address { get; set; }

        public bool IsActive { get; private set; }

        protected User()
        {

        }

        public User(string name, string userName, string gstNumber, string mobileNumber, string email,
             string shopName, string logo, string address):this()
        {
            Name = name;
            UserName = userName;
            MobileNumber = mobileNumber;
            Email = email;
            ShopName = shopName;
            GSTNumber = gstNumber;
            Logo = logo;
            Address = address;
            IsActive = true;
        }

        public void SetPassword(string password, IPasswordHasher<User> passwordHasher)
        {
            if (string.IsNullOrWhiteSpace(password))
            {
                throw new UniventoryDomainException("Password can not be empty");
            }

            PasswordHash = passwordHasher.HashPassword(this, password);
        }

        public void SetExistingPassword(string password)
        {
            if (string.IsNullOrWhiteSpace(password))
            {
                throw new UniventoryDomainException("Password can not be empty");
            }

            PasswordHash = password;
        }

        public bool ValidatePassword(string password, IPasswordHasher<User> passwordHasher)
        {
            return passwordHasher.VerifyHashedPassword(this, PasswordHash, password) != PasswordVerificationResult.Failed;
        }

        public void Deactivate()
        {
            this.IsActive = false;
        }

        public void setId(int id)
        {
            this.Id = id;
        }
    }
}
