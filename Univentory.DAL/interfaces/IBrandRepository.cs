using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Univentory.Common.helper;
using Univentory.Domain.entities;

namespace Univentory.DAL.interfaces
{
    public interface IBrandRepository:IRepository
    {
        ProductBrand AddBrand(ProductBrand brand);

        Task<ProductBrand> GetBrandType(int userId, string searchKey);

        Task<ProductBrand> GetBrandById(int id);

        Task<PaginatedResultBase<ProductBrand>> GetBrandTypes(int userId, int pageIndex, int pageSize);

        Task<PaginatedResultBase<ProductBrand>> GetSearchBrandTypes(int userId, string searchKey, int pageIndex, int pageSize);
    }
}
