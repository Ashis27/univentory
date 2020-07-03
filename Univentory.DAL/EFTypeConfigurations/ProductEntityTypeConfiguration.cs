using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;
using Univentory.Domain.entities;

namespace Univentory.DAL.EFTypeConfigurations
{
    public class ProductEntityTypeConfiguration : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            builder.ToTable("Products", UniventoryContext.DEFAULT_SCHEMA);

            builder.HasKey(p => p.Id);

            builder.Property(p => p.Id)
                .UseHiLo("productseq", UniventoryContext.DEFAULT_SCHEMA);

            builder.Property(p => p.UserId)
             .IsRequired();

            builder.Property(p => p.Description)
                  .IsRequired(false);

            builder.HasOne(p => p.Brand)
                   .WithMany()
                   .HasForeignKey(p=>p.BrandId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(p => p.Category)
                   .WithMany()
                   .HasForeignKey(p=>p.CategoryId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(p => p.Vendor)
                   .WithMany()
                   .HasForeignKey(p=>p.VendorId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
