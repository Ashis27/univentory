using System;
using System.Collections.Generic;
using System.Text;

namespace Univentory.Domain.entities
{
    public class ProductCategory:BaseEntity
    {
        private int _userId;

        public int UserId => _userId;

        public string Name { get; private set; }

        public string Description { get; private set; }

        public bool IsActive { get; private set; }

        protected ProductCategory()
        {

        }

        public ProductCategory(int userId, string name, string description) : this()
        {
            _userId = userId;
            Name = name;
            Description = description;
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
