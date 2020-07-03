using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Univentory.Common.helper;
using Univentory.Services.dtos;

namespace Univentory.Services.interfaces
{
    public interface ICategoryService
    {
        Task<CategoryViewModel> AddCategory(CategoryViewModel model);

        Task<CategoryViewModel> GetCategoryById(int id);

        Task<PaginatedResultBase<CategoryViewModel>> GetCategoryTypes(int userId, int pageIndex, int pageSize);

        Task<PaginatedResultBase<CategoryViewModel>> GetSearchCategoryTypes(int userId, string searchKey, int pageIndex, int pageSize);
    }
}
