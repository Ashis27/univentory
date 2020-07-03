using System;
using System.Collections.Generic;
using System.Text;
using Univentory.Common.filters;

namespace Univentory.Domain.entities
{
    public class Product : BaseEntity
    {
        private int _userId;

        public int UserId => _userId;

        public string Name { get; private set; }

        public string Code { get; private set; }

        public decimal PurchasePrice { get; private set; }

        public decimal SellPrice { get; private set; }

        public int CategoryId { get;private set; }

        public ProductCategory Category { get; private set; }

        public int BrandId { get; private set; }

        public ProductBrand Brand { get; private set; }

        public int VendorId { get; private set; }

        public Vendor Vendor { get; private set; }

        public string Description { get; private set; }

        public decimal TaxRateInPercentage { get; private set; }

        public decimal DiscountInPercntage { get; private set; }

        public int AvailableStock { get; private set; }

        public int MaxStockThreshold { get; private set; }

        public bool IsActive { get; private set; }

        protected Product()
        {

        }
        public Product(int userId, string name, string code, decimal salePrice, decimal purchasePrice, int brandId, int categoryId,
            int vendorId, string description, decimal taxPerc, decimal discountPerc, int availableStock)
        {
            _userId = userId;
            BrandId = brandId;
            CategoryId = categoryId;
            VendorId = vendorId;
            IsActive = true;
            Name = name;
            Code = code;
            SellPrice = salePrice;
            PurchasePrice = purchasePrice;
            Description = description;
            TaxRateInPercentage = taxPerc;
            DiscountInPercntage = discountPerc;
            AvailableStock = availableStock;
        }

        public int RemoveStock(int quantityDesired)
        {
            if (AvailableStock == 0)
            {
                throw new UniventoryDomainException($"Empty stock, product item {Name} is sold out");
            }

            if (AvailableStock < quantityDesired)
            {
                throw new UniventoryDomainException($"Item units desired should not be greater than available stock. {AvailableStock} is available in stock.");
            }

            if (quantityDesired <= 0)
            {
                throw new UniventoryDomainException($"Item units desired should be greater than zero");
            }

            int removed = Math.Min(quantityDesired, this.AvailableStock);

            this.AvailableStock -= removed;

            return removed;
        }


        public void DeactivateProduct()
        {
            this.IsActive = false;
        }

        public void setProductId(int id)
        {
            this.Id = id;
        }
    }
}
