using System;
using System.Collections.Generic;
using System.Text;

namespace Univentory.Services.dtos
{
    public class SellProductHistoryViewModel
    {
        public int SellId { get; set; }

        public int ProductId { get; set; }

        public int Unit { get;  set; }

        public decimal SellPrice { get;  set; }

        public string Descrption { get;  set; }

        public decimal TaxRateInPercentage { get;  set; }

        public decimal DiscountInPercntage { get;  set; }

        public ProductViewModel Product { get; set; }
    }
}
