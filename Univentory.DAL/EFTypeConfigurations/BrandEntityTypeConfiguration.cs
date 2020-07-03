using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;
using Univentory.Domain.entities;

namespace Univentory.DAL.EFTypeConfigurations
{
    public class BrandEntityTypeConfiguration : IEntityTypeConfiguration<ProductBrand>
    {
        public void Configure(EntityTypeBuilder<ProductBrand> builder)
        {
            builder.ToTable("ProductBrands", UniventoryContext.DEFAULT_SCHEMA);

            builder.HasKey(p => p.Id);

            builder.Property(p => p.Id)
                   .UseHiLo("brandseq", UniventoryContext.DEFAULT_SCHEMA);

            builder.Property(p => p.UserId)
                 .IsRequired();

            builder.Property(p => p.Name)
                   .IsRequired();

            builder.Property(p => p.Description)
                   .IsRequired(false);
        }
    }
}
