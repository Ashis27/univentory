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
    public class UserRepository : IUserRepository
    {
        private readonly UniventoryContext _context;

        public IUnitOfWork UnitOfWork => _context;

        public UserRepository(UniventoryContext context)
        {
            _context = context;
        }

        public Consumer AddConsumer(Consumer consumer)
        {
            return this._context.Consumers.Add(consumer).Entity;
        }

        public async Task AddUser(User user)
        {
            await this._context.Users.AddAsync(user);
        }

        public Vendor AddVendor(Vendor vendor)
        {
            return this._context.Vendors.Add(vendor).Entity;
        }

        public async Task<PaginatedResultBase<Consumer>> GetSearchConsumers(int userId, string searchKeyword, int pageIndex, int pageSize)
        {
            IQueryable<Consumer> consumers = null;

            if (!String.IsNullOrWhiteSpace(searchKeyword))
            {
                consumers = this._context.Consumers.Where(p => p.UserId == userId && 
                                    (p.Name.ToLower().Contains(searchKeyword.ToLower()) || p.MobileNumber.ToLower().Contains(searchKeyword.ToLower()))).AsQueryable();
            }
            else
            {
                consumers = this._context.Consumers.Where(p => p.UserId == userId).AsQueryable();
            }

            return await PaginatedResultBase<Consumer>.CreateAsync(consumers.AsNoTracking(), pageIndex, pageSize);
        }

        public async Task<PaginatedResultBase<Vendor>> GetSearchVendors(int userId, string searchKeyword, int pageIndex, int pageSize)
        {
            IQueryable<Vendor> vendors = null;

            if (!String.IsNullOrWhiteSpace(searchKeyword))
            {
                vendors = this._context.Vendors.Where(p => p.UserId == userId && 
                                            (p.Name.ToLower().Contains(searchKeyword.ToLower()) || p.MobileNumber.ToLower().Contains(searchKeyword.ToLower()))).AsQueryable();
            }
            else
            {
                vendors = this._context.Vendors.Where(p => p.UserId == userId).AsQueryable();
            }

            return await PaginatedResultBase<Vendor>.CreateAsync(vendors.AsNoTracking(), pageIndex, pageSize);
        }

        public async Task<User> GetUserById(int id)
        {
            return await this._context.Users.FindAsync(id);
        }

        public async Task<User> GetUserByName(string userName)
        {
            return await this._context.Users.Where(p => p.UserName == userName).FirstOrDefaultAsync();
        }

        public void UpdateVendor(Vendor vendor)
        {
            this._context.Vendors.Update(vendor);
        }

        public void UpdateConsumer(Consumer consumer)
        {
            this._context.Consumers.Update(consumer);
        }

        public async Task<User> GetUserProfile(int userId)
        {
            return await this._context.Users.FindAsync(userId);
        }

        public void UpdateUserProfile(User user)
        {
            this._context.Users.Update(user);
        }
    }
}
