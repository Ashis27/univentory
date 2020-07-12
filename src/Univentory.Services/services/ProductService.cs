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
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;
        private readonly IMapper _mapper;

        public ProductService(IProductRepository productRepository, IMapper mapper)
        {
            _productRepository = productRepository;
            _mapper = mapper;
        }

        public async Task AddProductItem(ProductViewModel model)
        {
            var product = await _productRepository.GetProductItemByCode(model.UserId, model.Code);

            if (product != null)
            {
                throw new UniventoryDomainException($"Product already exist with code : {model.Code}");
            }

            var productItem = new Product(model.UserId, model.Name, model.Code, model.SellPrice, model.PurchasePrice, model.BrandId,
                                    model.CategoryId, model.VendorId, model.Description, model.TaxRateInPercentage,
                                    model.DiscountInPercntage, model.AvailableStock);

            await _productRepository.AddProductItem(productItem);
            await _productRepository.UnitOfWork.SaveEntitiesAsync();
        }

        public async Task DeleteProduct(int id)
        {
            var product = await _productRepository.GetProductItemById(id);

            if (product == null)
            {
                throw new UniventoryDomainException($"Product doesn't exist with id : {id}");
            }

            product.DeactivateProduct();
            _productRepository.UpdateProduct(product);
            await _productRepository.UnitOfWork.SaveEntitiesAsync();
        }

        public async Task<ProductViewModel> GetProductItem(int id)
        {
            var product = _mapper.Map<Product, ProductViewModel>(await _productRepository.GetProductItemById(id));

            return product;
        }

        public async Task<PaginatedResultBase<ProductViewModel>> GetProductItemsByVendorId(int userId, int vendorId, int pageIndex, int pageSize, bool isActive)
        {
            var products = _mapper.Map<PaginatedResultBase<Product>, PaginatedResultBase<ProductViewModel>>
                                                (await _productRepository.GetProductItemsByVendorId(userId, vendorId, pageIndex, pageSize, isActive));

            return products;
        }

        public async Task<PaginatedResultBase<ProductViewModel>> GetSearchProductItems(SearchViewModel model)
        {
            var products = _mapper.Map<PaginatedResultBase<Product>, PaginatedResultBase<ProductViewModel>>
                                                (await _productRepository.GetSearchProductItems(model.UserId, model.Keyword,
                                                    model.PageIndex, model.PageSize, model.IsActive));

            return products;
        }


        public async Task UpdateProduct(ProductViewModel model)
        {
            //var product = await _productRepository.GetProductItemById(model.Id);

            //if (product == null || product.Code != model.Code)
            //{
            //    throw new UniventoryDomainException($"Product doesn't exist with id : {model.Id} and code: {model.Code}");
            //}

            //var result = await _productRepository.GetProductItemByCode(model.UserId, model.Code);

            //if (result != null)
            //{
            //    throw new UniventoryDomainException($"Product already exist with code : {model.Code}");
            //}

            var productItem = new Product(model.UserId, model.Name, model.Code, model.SellPrice, model.PurchasePrice, model.BrandId,
                                    model.CategoryId, model.VendorId, model.Description, model.TaxRateInPercentage,
                                    model.DiscountInPercntage, model.AvailableStock);

            //product = productItem;
            productItem.setProductId(model.Id);
            _productRepository.UpdateProduct(productItem);
            await _productRepository.UnitOfWork.SaveEntitiesAsync();
        }
    }
}
