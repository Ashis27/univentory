using Microsoft.AspNetCore.Routing.Tree;
using System;
using System.Collections.Generic;
using System.Text;

namespace Univentory.Domain.entities
{
    public class SellProductHistory : BaseEntity
    {
        public int Unit { get; private set; }

        public decimal SalePrice { get; private set; }

        public string Descrption { get; private set; }

        public decimal TaxRateInPercentage { get; private set; }

        public decimal DiscountInPercntage { get; private set; }

        public int ProductId { get; private set; }

        public Product Product { get; private set; }

        public bool IsActive { get; private set; }

        protected SellProductHistory()
        {

        }

        public SellProductHistory(int productId, decimal salePrice, string description, decimal taxRateInPerc,
            decimal discountInPerc, int unit)
        {
            ProductId = productId;
            SalePrice = salePrice;
            Descrption = description;
            TaxRateInPercentage = taxRateInPerc;
            DiscountInPercntage = discountInPerc;
            Unit = unit;
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
