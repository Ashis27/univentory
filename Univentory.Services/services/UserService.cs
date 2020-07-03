using AutoMapper;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Univentory.Common.filters;
using Univentory.Common.helper;
using Univentory.DAL.interfaces;
using Univentory.Domain.entities;
using Univentory.Services.dtos;
using Univentory.Services.Helpers;
using Univentory.Services.interfaces;

namespace Univentory.Services.services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IJwtAuthServices _jwtAuthServices;
        private readonly IMapper _mapper;
        private readonly IPasswordHasher<User> _passwordHasher;

        public UserService(IPasswordHasher<User> passwordHasher, IUserRepository userRepository, IJwtAuthServices jwtAuthServices,
            IMapper mapper)
        {
            _passwordHasher = passwordHasher;
            _userRepository = userRepository;
            _jwtAuthServices = jwtAuthServices;
            _mapper = mapper;
        }

        public async Task<Token> Authenticate(UserLoginViewModel userLoginViewModel)
        {
            var user = await _userRepository.GetUserByName(userLoginViewModel.UserName);

            if (user == null || !user.ValidatePassword(userLoginViewModel.Password, _passwordHasher))
            {
                throw new UniventoryDomainException("Invalid credentials.");
            }

            Token token = await _jwtAuthServices.GenerateEncodedJWTAsync(user.Id.ToString(), user.UserName, Role.User);
            token.MobileNumber = user.MobileNumber;
            token.Address = user.Address;
            token.shopName = user.ShopName;
            token.GSTNumber = user.GSTNumber;

            return token;
        }

        public async Task<ConsumerViewModel> AddConsumer(ConsumerViewModel model)
        {
            Consumer consumer = new Consumer(model.UserId, model.Name, model.Email, model.MobileNumber, model.BillingAddress);

            var result = _mapper.Map<Consumer, ConsumerViewModel>(_userRepository.AddConsumer(consumer));
            await _userRepository.UnitOfWork.SaveEntitiesAsync();

            return result;
        }

        public async Task<VendorViewModel> AddVendor(VendorViewModel model)
        {
            Vendor vendor = new Vendor(model.UserId, model.Name, model.Email, model.MobileNumber, model.BillingAddress);

            var result = _mapper.Map<Vendor, VendorViewModel>(_userRepository.AddVendor(vendor));
            await _userRepository.UnitOfWork.SaveEntitiesAsync();


            return result;
        }

        public async Task AddUser(UserViewModel model)
        {
            var userInfo = await _userRepository.GetUserByName(model.UserName);

            if (userInfo != null)
            {
                throw new UniventoryDomainException($"User name is already exist with: {model.UserName}");
            }

            User user = new User(model.Name, model.UserName, model.GSTNumber, model.MobileNumber, model.Email, model.ShopName,
                model.Logo, model.Address);


            user.SetPassword(model.PasswordHash, _passwordHasher);

            await _userRepository.AddUser(user);
            await _userRepository.UnitOfWork.SaveEntitiesAsync();
        }

        public async Task<PaginatedResultBase<ConsumerViewModel>> GetSearchConsumers(int userId, string searchKeyword, int pageIndex, int pageSize)
        {
            var consumers = _mapper.Map<PaginatedResultBase<Consumer>, PaginatedResultBase<ConsumerViewModel>>(await _userRepository.GetSearchConsumers(userId, searchKeyword, pageIndex, pageSize));

            return consumers;
        }

        public async Task<PaginatedResultBase<VendorViewModel>> GetSearchVendors(int userId, string searchKeyword, int pageIndex, int pageSize)
        {
            var vendors = _mapper.Map<PaginatedResultBase<Vendor>, PaginatedResultBase<VendorViewModel>>(await _userRepository.GetSearchVendors(userId, searchKeyword, pageIndex, pageSize));

            return vendors;
        }

        public async Task UpdateVendor(VendorViewModel model)
        {
            Vendor vendor = new Vendor(model.UserId, model.Name, model.Email, model.MobileNumber, model.BillingAddress);

            vendor.setId(model.Id);
            _userRepository.UpdateVendor(vendor);
            await _userRepository.UnitOfWork.SaveEntitiesAsync();
        }

        public async Task UpdateConsumer(ConsumerViewModel model)
        {
            Consumer consumer = new Consumer(model.UserId, model.Name, model.Email, model.MobileNumber, model.BillingAddress);

            consumer.setId(model.Id);
            _userRepository.UpdateConsumer(consumer);
            await _userRepository.UnitOfWork.SaveEntitiesAsync();
        }

        public async Task<UserViewModel> GetUserProfile(int userId)
        {
            var userProfile = _mapper.Map<User, UserViewModel>(await _userRepository.GetUserProfile(userId));

            return userProfile;
        }

        public async Task UpdateUserProfile(UserViewModel model)
        {
            User user = new User(model.Name, model.UserName, model.GSTNumber, model.MobileNumber, model.Email, model.ShopName, null, model.Address);

            user.setId(model.Id);
            user.SetExistingPassword(model.PasswordHash);
            _userRepository.UpdateUserProfile(user);
            await _userRepository.UnitOfWork.SaveEntitiesAsync();
        }
    }
}
