using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Univentory.Common.helper;
using Univentory.Domain.entities;

namespace Univentory.DAL.interfaces
{
    public interface IProductSellRepository : IRepository
    {
        Task SellProducts(SellProduct sell);

        Task<SellProduct> GetSellProductById(int id);

        Task<PaginatedResultBase<SellProduct>> GetSellProducts(int userId, string searchKeyword, int pageIndex, int pageSize);

        void DeleteSellProduct(SellProduct sell);

        Task<PaginatedResultBase<SellProductHistory>> GetSellProductHistoryById(int saleId, int pageIndex, int pageSize);
        Task<PaginatedResultBase<SellProduct>> GetSellProductItemsByConsumerId(int userId, int consumerId, int pageIndex, int pageSize);
    }
}
