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
    public class CategoryRepository : ICategoryRepository
    {
        private readonly UniventoryContext _context;

        public IUnitOfWork UnitOfWork => _context;

        public CategoryRepository(UniventoryContext context)
        {
            _context = context;
        }

        public ProductCategory AddCategory(ProductCategory category)
        {
            return this._context.ProductCategories.Add(category).Entity;
        }

        public async Task<ProductCategory> GetCategoryType(int userId, string searchKey)
        {
            return await this._context.ProductCategories.Where(p => p.UserId == userId && p.Name == searchKey).FirstOrDefaultAsync();
        }

        public async Task<PaginatedResultBase<ProductCategory>> GetCategoryTypes(int userId, int pageIndex, int pageSize)
        {
            IQueryable<ProductCategory> categories = null;
            categories = this._context.ProductCategories.Where(p => p.UserId == userId).AsQueryable();

            return await PaginatedResultBase<ProductCategory>.CreateAsync(categories.AsNoTracking(), pageIndex, pageSize);
        }

        public async Task<ProductCategory> GetCategoryById(int id)
        {
            return await this._context.ProductCategories.FindAsync(id);
        }

        public async Task<PaginatedResultBase<ProductCategory>> GetSearchCategoryTypes(int userId, string searchKey, int pageIndex, int pageSize)
        {
            IQueryable<ProductCategory> categories = null;

            if (!String.IsNullOrWhiteSpace(searchKey))
            {
                categories = this._context.ProductCategories.Where(p => p.UserId == userId && (p.Name.ToLower().Contains(searchKey.ToLower()))).AsQueryable();
            }
            else
            {
                categories = this._context.ProductCategories.Where(p => p.UserId == userId).AsQueryable();
            }

            return await PaginatedResultBase<ProductCategory>.CreateAsync(categories.AsNoTracking(), pageIndex, pageSize);
        }
    }
}
