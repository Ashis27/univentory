using System;
using System.Collections.Generic;
using System.Text;

namespace Univentory.Domain.entities
{
    public class SellProduct : BaseEntity
    {
        private int _userId;

        public int UserId => _userId;

        public decimal TotalPaid { get; private set; }

        public decimal TotalPrice { get; private set; }

        public int ConsumerId { get; private set; }

        public Consumer Consumer { get; private set; }


        private readonly List<SellProductHistory> _sellProductHistory;

        public IReadOnlyCollection<SellProductHistory> SellProductHistory => _sellProductHistory;

        public bool IsActive { get; private set; }

        protected SellProduct()
        {

        }

        public SellProduct(int userId, int consumerId, decimal totalPaid, decimal totalPrice) : this()
        {
            _sellProductHistory = new List<SellProductHistory>();
            _userId = userId;
            ConsumerId = consumerId;
            TotalPaid = totalPaid;
            TotalPrice = totalPrice;
            IsActive = true;
        }


        public void AddSaleItem(int saleId, int productId, decimal sellPrice, string description, decimal taxRateInPerc,
            decimal discountInPerc, int unit)
        {
            var saleHistory = new SellProductHistory(productId, sellPrice, description, taxRateInPerc, discountInPerc, unit);
 
            _sellProductHistory.Add(saleHistory);
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
 