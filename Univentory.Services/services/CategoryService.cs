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
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IMapper _mapper;

        public CategoryService(ICategoryRepository categoryRepository, IMapper mapper)
        {
            _categoryRepository = categoryRepository;
            _mapper = mapper;
        }

        public async Task<CategoryViewModel> AddCategory(CategoryViewModel model)
        {
            var category = await _categoryRepository.GetCategoryType(model.UserId, model.Name);

            if (category != null)
            {
                throw new UniventoryDomainException($"Category already exist with name : {model.Name}");
            }

            var categoryItem = new ProductCategory(model.UserId, model.Name, model.Description);
            var result = _mapper.Map<ProductCategory, CategoryViewModel>(_categoryRepository.AddCategory(categoryItem));
            await _categoryRepository.UnitOfWork.SaveEntitiesAsync();

            return result;
        }

        public async Task<CategoryViewModel> GetCategoryById(int id)
        {
            var category = _mapper.Map<ProductCategory, CategoryViewModel>(await _categoryRepository.GetCategoryById(id));

            return category;
        }

        public async Task<PaginatedResultBase<CategoryViewModel>> GetCategoryTypes(int userId, int pageIndex, int pageSize)
        {
            var categories = _mapper.Map<PaginatedResultBase<ProductCategory>, PaginatedResultBase<CategoryViewModel>>
                                                            (await _categoryRepository.GetCategoryTypes(userId, pageIndex, pageSize));

            return categories;
        }

        public async Task<PaginatedResultBase<CategoryViewModel>> GetSearchCategoryTypes(int userId, string searchKey, int pageIndex, int pageSize)
        {
            var categories = _mapper.Map<PaginatedResultBase<ProductCategory>, PaginatedResultBase<CategoryViewModel>>
                                                            (await _categoryRepository.GetSearchCategoryTypes(userId, searchKey, pageIndex, pageSize));

            return categories;
        }
    }
}
