using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Univentory.Common.uow;
using Univentory.DAL.EFTypeConfigurations;
using Univentory.Domain.entities;

namespace Univentory.DAL
{
    public class UniventoryContext : DbContext, IUnitOfWork
    {
        public const string DEFAULT_SCHEMA = "univentory";

        private readonly IHttpContextAccessor _httpContextAccessor;

        public DbSet<User> Users { get; set; }

        public DbSet<Consumer> Consumers { get; set; }

        public DbSet<Vendor> Vendors { get; set; }

        public DbSet<Product> Products { get; set; }

        public DbSet<ProductBrand> ProductBrands { get; set; }

        public DbSet<ProductCategory> ProductCategories { get; set; }

        public DbSet<SellProduct> SellPrducts { get; set; }


        public DbSet<SellProductHistory> SellPrductHistory { get; set; }


        public UniventoryContext(DbContextOptions<UniventoryContext> options, IHttpContextAccessor httpContextAccessor) : base(options)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public class UniventoryContextDesignFactory : IDesignTimeDbContextFactory<UniventoryContext>
        {
            public UniventoryContext CreateDbContext(string[] args)
            {
                var optionsBuilder = new DbContextOptionsBuilder<UniventoryContext>()
                    .UseSqlServer("Server=tcp:univentory.database.windows.net,1433;Initial Catalog=UniventoryContext;Persist Security Info=False;User ID=Univentory;Password=Uni@123456;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;");

                return new UniventoryContext(optionsBuilder.Options, null);
            }
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.ApplyConfiguration(new UserEntityTypeConfiguration());
            builder.ApplyConfiguration(new ConsumerEntityTypeConfiguration());
            builder.ApplyConfiguration(new VendorEntityTypeConfiguration());
            builder.ApplyConfiguration(new ProductEntityTypeConfiguration());
            builder.ApplyConfiguration(new BrandEntityTypeConfiguration());
            builder.ApplyConfiguration(new CategoryEntityTypeConfiguration());
            builder.ApplyConfiguration(new SellProductEntityTypeConfiguration());
            builder.ApplyConfiguration(new SellProductHistoryEntityTypeConfiguration());
        }

        public async Task<bool> SaveEntitiesAsync(CancellationToken cancellationToken = default)
        {

            //get entries that are being Added or Updated
            var modifiedEntries = this.ChangeTracker.Entries()
                    .Where(x => (x.State == EntityState.Added || x.State == EntityState.Modified));

            var userId = "0";
            if (_httpContextAccessor.HttpContext != null)
                userId = _httpContextAccessor?.HttpContext?.User?.FindFirst("sub")?.Value;

            if(userId == null)
            {
                userId = "0";
            }

            foreach (var entry in modifiedEntries)
            {
                var entity = entry.Entity;
                PropertyInfo createdBy = entry.Entity.GetType().GetProperty("CreatedBy");
                PropertyInfo createdDate = entry.Entity.GetType().GetProperty("CreatedDate");

                if (entry.State == EntityState.Added)
                {
                    if (null != createdBy && createdBy.CanWrite)
                        createdBy.SetValue(entry.Entity, int.Parse(userId), null);
                    if (null != createdDate && createdDate.CanWrite)
                        createdDate.SetValue(entry.Entity, DateTime.Now, null);
                }
                else if (entry.State == EntityState.Modified)
                {
                    var dbValueOfEntity = this.Entry(entry.Entity).GetDatabaseValues();
                    var cd = dbValueOfEntity?.GetValue<DateTime?>("CreatedDate");
                    var cb = dbValueOfEntity?.GetValue<int>("CreatedBy");
                    if (null != cb)
                        createdBy.SetValue(entry.Entity, cb, null);
                    if (null != cd)
                        createdDate.SetValue(entry.Entity, cd, null);
                }
                PropertyInfo modifiedBy = entry.Entity.GetType().GetProperty("UpdatedBy");
                PropertyInfo modifiedDate = entry.Entity.GetType().GetProperty("UpdatedDate");
                if (null != modifiedBy && modifiedBy.CanWrite)
                    modifiedBy.SetValue(entry.Entity, int.Parse(userId), null);
                if (null != modifiedDate && modifiedDate.CanWrite)
                    modifiedDate.SetValue(entry.Entity, DateTime.Now, null);
            }

            await base.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
