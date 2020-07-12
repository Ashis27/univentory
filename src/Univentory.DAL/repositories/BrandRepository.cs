using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Univentory.Common.helper;
using Univentory.Common.uow;
using Univentory.DAL.interfaces;
using Univentory.Domain.entities;

namespace Univentory.DAL.repositories
{
    public class BrandRepository:IBrandRepository
    {
        private readonly UniventoryContext _context;

        public IUnitOfWork UnitOfWork => _context;

        public BrandRepository(UniventoryContext context)
        {
            _context = context;
        }

        public ProductBrand AddBrand(ProductBrand brand)
        {
            return this._context.ProductBrands.Add(brand).Entity;
        }

        public async Task<PaginatedResultBase<ProductBrand>> GetBrandTypes(int userId, int pageIndex, int pageSize)
        {
            IQueryable<ProductBrand> categories = null;
            categories =  this._context.ProductBrands.Where(p => p.UserId == userId).AsQueryable();

            return await PaginatedResultBase<ProductBrand>.CreateAsync(categories.AsNoTracking(), pageIndex, pageSize);
        }

        public async Task<ProductBrand> GetBrandType(int userId, string searchKey)
        {
            return await this._context.ProductBrands.Where(p => p.UserId == userId && p.Name == searchKey).FirstOrDefaultAsync();
        }

        public async Task<PaginatedResultBase<ProductBrand>> GetSearchBrandTypes(int userId, string searchKey, int pageIndex, int pageSize)
        {
            IQueryable<ProductBrand> categories = null;

            if (!String.IsNullOrWhiteSpace(searchKey))
            {
                categories = this._context.ProductBrands.Where(p => p.UserId == userId && (p.Name.ToLower().Contains(searchKey.ToLower()))).AsQueryable();
            }
            else
            {
                categories = this._context.ProductBrands.Where(p => p.UserId == userId).AsQueryable();
            }

            return await PaginatedResultBase<ProductBrand>.CreateAsync(categories.AsNoTracking(), pageIndex, pageSize);
        }

        public async Task<ProductBrand> GetBrandById(int id)
        {
            return await this._context.ProductBrands.FindAsync(id);
        }
    }
}
