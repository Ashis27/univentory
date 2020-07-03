using System;
using System.Collections.Generic;
using System.Text;

namespace Univentory.Domain.entities
{
    public class Consumer : BaseEntity
    {
        private int _userId;

        public int UserId => _userId;
        
        public string Name { get; private set; }

        public string Email { get; private set; }

        public string MobileNumber { get; private set; }

        //public string State { get; private set; }

        //public string City { get; private set; }

        //public string ZipCode { get; private set; }

        //public string Country { get; private set; }

        public string BillingAddress { get; private set; }

        public bool IsActive { get; private set; }

        protected Consumer()
        {
            
        }

        public Consumer(int userId, string name, string email, string mobileNumber, string billingAddress) : this()
        {
            _userId = userId;
            Name = name;
            Email = email;
            MobileNumber = mobileNumber;
            BillingAddress = billingAddress;
            IsActive = true;
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
