using System;
using System.Collections.Generic;
using System.Text;

namespace Univentory.Services.dtos
{
    public class SellProductViewModel
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public int ConsumerId { get; set; }

        public decimal TotalPaid { get; set; }

        public decimal TotalPrice { get; set; }

        public ConsumerViewModel Consumer { get; set; }

        public DateTime CreatedDate { get; set; }

        public List<SellProductHistoryViewModel> SellHistory { get; set; }
    }
}
