using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Univentory.Common.helper;
using Univentory.Domain.entities;

namespace Univentory.DAL.interfaces
{
   public interface IProductRepository:IRepository
    {
        Task AddProductItem(Product product);

        void UpdateProduct(Product product);

        Task<PaginatedResultBase<Product>> GetSearchProductItems(int userId, string searchKey, int pageIndex, int pageSize, bool isActive);

        Task<Product> GetProductItemById(int id);

        Task<Product> GetProductItemByCode(int userId, string searchCode);
        Task<PaginatedResultBase<Product>> GetProductItemsByVendorId(int userId, int vendorId, int pageIndex, int pageSize, bool isActive);
    }
}
