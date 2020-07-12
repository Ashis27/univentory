using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Univentory.Common.helper;
using Univentory.Domain.entities;

namespace Univentory.DAL.interfaces
{
    public interface ICategoryRepository : IRepository
    {
        ProductCategory AddCategory(ProductCategory category);

        Task<ProductCategory> GetCategoryType(int userId, string searchKey);

        Task<PaginatedResultBase<ProductCategory>> GetCategoryTypes(int userId, int pageIndex, int pageSize);

        Task<ProductCategory> GetCategoryById(int id);

        Task<PaginatedResultBase<ProductCategory>> GetSearchCategoryTypes(int userId, string searchKey, int pageIndex, int pageSize);
    }
}
