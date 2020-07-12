using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Univentory.Common.helper;
using Univentory.Services.dtos;
using Univentory.Services.Helpers;

namespace Univentory.Services.interfaces
{
    public interface IUserService
    {
        Task<Token> Authenticate(UserLoginViewModel userLoginViewModel);
        Task<ConsumerViewModel> AddConsumer(ConsumerViewModel model);
        Task<VendorViewModel> AddVendor(VendorViewModel model);
        Task AddUser(UserViewModel model);
        Task<PaginatedResultBase<ConsumerViewModel>> GetSearchConsumers(int userId, string searchKeyword, int pageIndex, int pageSize);
        Task<PaginatedResultBase<VendorViewModel>> GetSearchVendors(int userId, string searchKeyword, int pageIndex, int pageSize);
        Task UpdateVendor(VendorViewModel model);
        Task UpdateConsumer(ConsumerViewModel model);
        Task<UserViewModel> GetUserProfile(int userId);
        Task UpdateUserProfile(UserViewModel model);
    }
}
