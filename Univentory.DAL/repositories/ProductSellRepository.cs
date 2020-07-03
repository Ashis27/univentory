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
using static Microsoft.EntityFrameworkCore.EF;

namespace Univentory.DAL.repositories
{
    public class ProductSellRepository : IProductSellRepository
    {
        private readonly UniventoryContext _context;

        public IUnitOfWork UnitOfWork => _context;

        public ProductSellRepository(UniventoryContext context)
        {
            _context = context;
        }

        public async Task SellProducts(SellProduct sell)
        {
            await this._context.SellPrducts.AddAsync(sell);
        }

        public async Task<PaginatedResultBase<SellProduct>> GetSellProducts(int userId, string searchKeyword, int pageIndex, int pageSize)
        {
            IQueryable<SellProduct> products = null;

            if (!String.IsNullOrWhiteSpace(searchKeyword))
            {
                products = this._context.SellPrducts.Include(p => p.Consumer).Where(p => p.UserId == userId
                             && (p.Id.ToString().Contains(searchKeyword) || p.Consumer.Name.Contains(searchKeyword) || p.Consumer.MobileNumber.Contains(searchKeyword)) && p.IsActive)
                            .OrderByDescending(p => p.CreatedDate).AsQueryable();
            }
            else
            {
                products = this._context.SellPrducts.Include(p => p.Consumer).Where(p => p.UserId == userId && p.IsActive).OrderByDescending(p => p.CreatedDate).AsQueryable();
            }

            return await PaginatedResultBase<SellProduct>.CreateAsync(products.AsNoTracking(), pageIndex, pageSize);
        }

        public async Task<PaginatedResultBase<SellProduct>> GetSellProductItemsByConsumerId(int userId, int consumerId, int pageIndex, int pageSize)
        {
            IQueryable<SellProduct> products = this._context.SellPrducts.Include(p => p.Consumer).Where(p => p.UserId == userId
                                       && p.ConsumerId == consumerId && p.IsActive).OrderByDescending(p => p.CreatedDate).AsQueryable();

            return await PaginatedResultBase<SellProduct>.CreateAsync(products.AsNoTracking(), pageIndex, pageSize);
        }

        public void DeleteSellProduct(SellProduct sell)
        {
            this._context.SellPrducts.Remove(sell);
        }

        public async Task<SellProduct> GetSellProductById(int id)
        {
            return await this._context.SellPrducts.Include(p => p.Consumer).Include(p => p.SellProductHistory).Where(p => p.Id == id).FirstOrDefaultAsync();
        }

        public async Task<PaginatedResultBase<SellProductHistory>> GetSellProductHistoryById(int saleId, int pageIndex, int pageSize)
        {

            IQueryable<SellProductHistory> productItems = this._context.SellPrductHistory.Include(p => p.Product).Where(p => Property<int>(p, "SellProductId") == saleId && p.IsActive).OrderByDescending(p => p.CreatedDate).AsQueryable();

            return await PaginatedResultBase<SellProductHistory>.CreateAsync(productItems.AsNoTracking(), pageIndex, pageSize);
        }
    }
}
