using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Univentory.Common.helper;
using Univentory.Services.dtos;

namespace Univentory.Services.interfaces
{
    public interface IBrandService
    {
        Task<BrandViewModel> AddBrand(BrandViewModel model);

        Task<BrandViewModel> GetBrandById(int id);

        Task<PaginatedResultBase<BrandViewModel>> GetBrandTypes(int userId, int pageIndex, int pageSize);

        Task<PaginatedResultBase<BrandViewModel>> GetSearchBrandTypes(int userId, string searchKey, int pageIndex, int pageSize);
    }
}
