using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Univentory.Common.helper;
using Univentory.Domain.entities;

namespace Univentory.DAL.interfaces
{
    public interface IUserRepository:IRepository
    {
        Task<User> GetUserById(int id);

        Task<User> GetUserByName(string userName);

        Task AddUser(User user);

        Consumer AddConsumer(Consumer consumer);

        Vendor AddVendor(Vendor vendor);

        Task<PaginatedResultBase<Consumer>> GetSearchConsumers(int userId, string searchKeyword, int pageIndex, int pageSize);

        Task<PaginatedResultBase<Vendor>> GetSearchVendors(int userId, string searchKeyword, int pageIndex, int pageSize);
        void UpdateVendor(Vendor vendor);
        void UpdateConsumer(Consumer consumer);
        Task<User> GetUserProfile(int userId);
        void UpdateUserProfile(User user);
    }
}
