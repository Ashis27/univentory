using AutoMapper;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Univentory.Common.filters;
using Univentory.Common.helper;
using Univentory.DAL.interfaces;
using Univentory.Domain.entities;
using Univentory.Services.dtos;
using Univentory.Services.interfaces;

namespace Univentory.Services.services
{
    public class BrandService : IBrandService
    {
        private readonly IBrandRepository _brandRepository;
        private readonly IMapper _mapper;

        public BrandService(IBrandRepository brandRepository, IMapper mapper)
        {
            _brandRepository = brandRepository;
            _mapper = mapper;
        }

        public async Task<BrandViewModel> AddBrand(BrandViewModel model)
        {
            var brand = await _brandRepository.GetBrandType(model.UserId, model.Name);

            if (brand != null)
            {
                throw new UniventoryDomainException($"Brand already exist with name : {model.Name}");
            }

            var brandItem = new ProductBrand(model.UserId, model.Name, model.Description);
            var result = _mapper.Map<ProductBrand, BrandViewModel>(_brandRepository.AddBrand(brandItem));
            await _brandRepository.UnitOfWork.SaveEntitiesAsync();

            return result;
        }


        public async Task<BrandViewModel> GetBrandById(int id)
        {
            var brand = _mapper.Map<ProductBrand, BrandViewModel>(await _brandRepository.GetBrandById(id));

            return brand;
        }

        public async Task<PaginatedResultBase<BrandViewModel>> GetBrandTypes(int userId, int pageIndex, int pageSize)
        {
            var brands = _mapper.Map<PaginatedResultBase<ProductBrand>, PaginatedResultBase<BrandViewModel>>(await _brandRepository.GetBrandTypes(userId, pageIndex,pageSize));

            return brands;
        }

        public async Task<PaginatedResultBase<BrandViewModel>> GetSearchBrandTypes(int userId, string searchKey, int pageIndex, int pageSize)
        {
            var brands = _mapper.Map<PaginatedResultBase<ProductBrand>, PaginatedResultBase<BrandViewModel>>(await _brandRepository.GetSearchBrandTypes(userId, searchKey, pageIndex, pageSize));

            return brands;
        }
    }
}
