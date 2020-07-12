using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Univentory.Common.helper;
using Univentory.Services.dtos;

namespace Univentory.Services.interfaces
{
    public interface IProductSellService
    {
        Task<int> SellProducts(SellProductViewModel model);

        Task<PaginatedResultBase<SellProductViewModel>> GetSellProducts(int userId, string searchKeyword, int pageIndex, int pageSize);

        Task<SellProductViewModel> GetSellProductById(int id);

        Task DeleteSellProduct(int id);

        Task<PaginatedResultBase<SellProductHistoryViewModel>> GetSellProductHistoryById(int saleId, int pageIndex, int pageSize);
        Task<PaginatedResultBase<SellProductViewModel>> GetSellProductItemsByConsumerId(int userId, int consumerId, int pageIndex, int pageSize);
    }
}
