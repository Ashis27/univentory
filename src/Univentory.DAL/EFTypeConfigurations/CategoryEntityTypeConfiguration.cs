using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;
using Univentory.Domain.entities;

namespace Univentory.DAL.EFTypeConfigurations
{
    public class CategoryEntityTypeConfiguration : IEntityTypeConfiguration<ProductCategory>
    {
        public void Configure(EntityTypeBuilder<ProductCategory> builder)
        {
            builder.ToTable("ProductCategories", UniventoryContext.DEFAULT_SCHEMA);

            builder.HasKey(p => p.Id);

            builder.Property(p => p.UserId)
             .IsRequired();

            builder.Property(p => p.Id)
                   .UseHiLo("categoryseq", UniventoryContext.DEFAULT_SCHEMA);

            builder.Property(p => p.Description)
                   .IsRequired(false);

        }
    }
}
