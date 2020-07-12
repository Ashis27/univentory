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
    public class SellProductService : IProductSellService
    {
        private readonly IProductSellRepository _repository;
        private readonly IProductRepository _productRepository;
        private readonly IMapper _mapper;

        public SellProductService(IProductSellRepository repository,IProductRepository productRepository, IMapper mapper)
        {
            _repository = repository;
            _productRepository = productRepository;
            _mapper = mapper;
        }

        public async Task DeleteSellProduct(int id)
        {
            var sellProduct = await _repository.GetSellProductById(id);

            if (sellProduct == null)
            {
                throw new UniventoryDomainException($"Sell Product doesn't exist with id : {id}");
            }

            _repository.DeleteSellProduct(sellProduct);
            await _repository.UnitOfWork.SaveEntitiesAsync();
        }

        public async Task<SellProductViewModel> GetSellProductById(int id)
        {
            var sellProduct = _mapper.Map<SellProduct, SellProductViewModel>(await _repository.GetSellProductById(id));

            return sellProduct;
        }

        //public async Task<SellProductViewModel> GetSellProductPriceDetails(int userId)
        //{
        //    var sellProducts = this.GetSellProducts(userId)

        //    return sellProduct;
        //}

        public async Task<PaginatedResultBase<SellProductViewModel>> GetSellProducts(int userId, string searchKeyword, int pageIndex, int pageSize)
        {
            var sellProducts = _mapper.Map<PaginatedResultBase<SellProduct>, PaginatedResultBase<SellProductViewModel>>(await _repository.GetSellProducts(userId, searchKeyword, pageIndex, pageSize));

            return sellProducts;
        }

        public async Task<PaginatedResultBase<SellProductViewModel>> GetSellProductItemsByConsumerId(int userId, int consumerId, int pageIndex, int pageSize)
        {
            var sellProducts = _mapper.Map<PaginatedResultBase<SellProduct>, PaginatedResultBase<SellProductViewModel>>(await _repository.GetSellProductItemsByConsumerId(userId, consumerId, pageIndex, pageSize));

            return sellProducts;
        }

        public async Task<int> SellProducts(SellProductViewModel model)
        {
            var sellProduct = new SellProduct(model.UserId, model.ConsumerId, model.TotalPaid, model.TotalPrice);

            if (model.SellHistory.Count > 0)
            {
                foreach (var item in model.SellHistory)
                {
                    sellProduct.AddSaleItem(sellProduct.Id, item.ProductId, item.SellPrice, item.Descrption, item.TaxRateInPercentage,
                                        item.DiscountInPercntage, item.Unit);

                    Product product = await _productRepository.GetProductItemById(item.ProductId);
                    product.RemoveStock(item.Unit);
                    _productRepository.UpdateProduct(product);
                }
            }
            await _repository.SellProducts(sellProduct);
            await _repository.UnitOfWork.SaveEntitiesAsync();

            return sellProduct.Id;
        }

        public async Task<PaginatedResultBase<SellProductHistoryViewModel>> GetSellProductHistoryById(int saleId, int pageIndex, int pageSize)
        {
            var sellProductItems = _mapper.Map<PaginatedResultBase<SellProductHistory>, PaginatedResultBase<SellProductHistoryViewModel>>(await _repository.GetSellProductHistoryById(saleId, pageIndex, pageSize));

            return sellProductItems;
        }
    }
}
