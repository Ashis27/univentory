using System;
using System.Collections.Generic;
using System.Text;

namespace Univentory.Services.dtos
{
    public class ProductViewModel
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public string Name { get; set; }

        public string Code { get; set; }

        public decimal PurchasePrice { get; set; }

        public decimal SellPrice { get; set; }

        public int CategoryId { get; set; }

        public int BrandId { get; set; }

        public int VendorId { get; set; }

        public CategoryViewModel Category { get; set; }

        public VendorViewModel Vendor { get; set; }

        public BrandViewModel Brand { get; set; }

        public string Description { get; set; }

        public decimal TaxRateInPercentage { get; set; }

        public decimal DiscountInPercntage { get; set; }

        public int AvailableStock { get; set; }

        public int MaxStockThreshold { get; set; }
    }
}
