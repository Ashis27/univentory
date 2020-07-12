using AutoMapper;
using System;
using System.Collections.Generic;
using System.Text;
using Univentory.Common.helper;
using Univentory.Domain.entities;
using Univentory.Services.dtos;

namespace Univentory.Services.automapper
{
    public class AutoMapping: Profile
    {
        public AutoMapping()
        {
            CreateMap<User, UserViewModel>();

            CreateMap<ProductBrand, BrandViewModel>();

            CreateMap<PaginatedResultBase<ProductBrand>,PaginatedResultBase<BrandViewModel>>();

            CreateMap<ProductCategory, CategoryViewModel>();

            CreateMap<PaginatedResultBase<ProductCategory>, PaginatedResultBase<CategoryViewModel>>();

            CreateMap<Product, ProductViewModel>();

            CreateMap<PaginatedResultBase<Product>, PaginatedResultBase<ProductViewModel>>();

            CreateMap<Vendor, VendorViewModel>();

            CreateMap<PaginatedResultBase<Vendor>, PaginatedResultBase<VendorViewModel>>();

            CreateMap<Consumer, ConsumerViewModel>();

            CreateMap<PaginatedResultBase<Consumer>, PaginatedResultBase<ConsumerViewModel>>();

            CreateMap<SellProduct, SellProductViewModel>();

            CreateMap<PaginatedResultBase<SellProduct>, PaginatedResultBase<SellProductViewModel>>();

            CreateMap<SellProductHistory, SellProductHistoryViewModel>()
                .ForMember(dest => dest.SellPrice, opt => opt.MapFrom(src => src.SalePrice));

            CreateMap<PaginatedResultBase<SellProductHistory>, PaginatedResultBase<SellProductHistoryViewModel>>();

            CreateMap<User, UserViewModel>();
        }
    }
}
