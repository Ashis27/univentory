using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Univentory.Common.filters;

namespace Univentory.Common.helper
{
    public class PaginatedResultBase<TEntity> where TEntity : class
    {
        public int PageIndex { get; private set; }

        public int PageSize { get; private set; }

        public int Count { get; private set; }

        public int TotalPages { get; private set; }

        public bool HasPreviousPage
        {
            get
            {
                return (PageIndex > 1);
            }
        }

        public bool HasNextPage
        {
            get
            {
                return (PageIndex < TotalPages);
            }
        }

        public IEnumerable<TEntity> Items { get; private set; }

        public PaginatedResultBase(IEnumerable<TEntity> items, int count, int pageIndex, int pageSize)
        {
            PageIndex = pageIndex;
            PageSize = pageSize;
            TotalPages = (int)Math.Ceiling(count / (double)pageSize);
            Count = count;
            Items = items;
        }

        public static async Task<PaginatedResultBase<TEntity>> CreateAsync(IQueryable<TEntity> source, int pageIndex, int pageSize)
        {
            try
            {
                int count = source.Count();

                if (count == 0)
                {
                    return new PaginatedResultBase<TEntity>(new List<TEntity>(), count, pageIndex, pageSize);
                }

                var items = source.Skip((pageIndex - 1) * pageSize).Take(pageSize).ToList();

                return new PaginatedResultBase<TEntity>(items, count, pageIndex, pageSize);
            }
            catch (Exception ex)
            {
                throw new UniventoryDomainException(ex.Message);
            }
        }
    }
}
