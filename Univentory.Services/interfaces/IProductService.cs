using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Univentory.Common.helper;
using Univentory.Services.dtos;

namespace Univentory.Services.interfaces
{
    public interface IProductService
    {
        Task AddProductItem(ProductViewModel model);

        Task UpdateProduct(ProductViewModel model);

        Task DeleteProduct(int id);

        Task<ProductViewModel> GetProductItem(int id);

        Task<PaginatedResultBase<ProductViewModel>> GetSearchProductItems(SearchViewModel model);
        Task<PaginatedResultBase<ProductViewModel>> GetProductItemsByVendorId(int userId, int vendorId, int pageIndex, int pageSize, bool isActive);
    }
}
