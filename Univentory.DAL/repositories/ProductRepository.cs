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
    public class ProductRepository : IProductRepository
    {
        private readonly UniventoryContext _context;

        public IUnitOfWork UnitOfWork => _context;

        public ProductRepository(UniventoryContext context)
        {
            _context = context;
        }

        public async Task AddProductItem(Product product)
        {
            await this._context.Products.AddAsync(product);
        }

        public void UpdateProduct(Product product)
        {
            this._context.Products.Update(product);
        }

        public async Task<Product> GetProductItemById(int id)
        {
            return await this._context.Products.FindAsync(id);
        }

        public async Task<PaginatedResultBase<Product>> GetSearchProductItems(int userId, string searchKey, int pageIndex, int pageSize, bool isActive)
        {
            IQueryable<Product> products = null;

            if (!String.IsNullOrWhiteSpace(searchKey))
            {
                products = this._context.Products.Include(p => p.Category).Include(p => p.Brand).Include(p => p.Vendor).Where(p => p.UserId == userId
                             && (p.Code.Contains(searchKey) || p.Name.Contains(searchKey)) && p.IsActive == isActive)
                            .OrderByDescending(p => p.CreatedDate).AsQueryable();
            }
            else
            {
                products = this._context.Products.Include(p => p.Category).Include(p => p.Brand).Include(p => p.Vendor).Where(p => p.UserId == userId && p.IsActive == isActive).OrderByDescending(p => p.CreatedDate).AsQueryable();
            }

            return await PaginatedResultBase<Product>.CreateAsync(products.AsNoTracking(), pageIndex, pageSize);
        }

        public async Task<Product> GetProductItemByCode(int userId, string searchCode)
        {
            return await this._context.Products.Where(p => p.UserId == userId && p.Code == searchCode).FirstOrDefaultAsync();
        }

        public async Task<PaginatedResultBase<Product>> GetProductItemsByVendorId(int userId, int vendorId, int pageIndex, int pageSize, bool isActive)
        {
            IQueryable<Product> products = this._context.Products.Include(p => p.Category).Include(p => p.Brand).Include(p => p.Vendor).Where(p => p.UserId == userId
                                                    && p.VendorId == vendorId && p.IsActive == isActive)
                                                    .OrderByDescending(p => p.CreatedDate).AsQueryable();

            return await PaginatedResultBase<Product>.CreateAsync(products.AsNoTracking(), pageIndex, pageSize);
        }
    }
}
