using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;
using Univentory.Domain.entities;

namespace Univentory.DAL.EFTypeConfigurations
{
    public class SellProductEntityTypeConfiguration : IEntityTypeConfiguration<SellProduct>
    {
        public void Configure(EntityTypeBuilder<SellProduct> builder)
        {
            builder.ToTable("SellProducts", UniventoryContext.DEFAULT_SCHEMA);

            builder.HasKey(p => p.Id);

            builder.Property(p => p.Id)
                   .UseHiLo("sellproductseq", UniventoryContext.DEFAULT_SCHEMA);

            var navigation = builder.Metadata.FindNavigation(nameof(SellProduct.SellProductHistory));

            // DDD Patterns comment:
            //Set as field (New since EF 1.1) to access the OrderItem collection property through its field
            navigation.SetPropertyAccessMode(PropertyAccessMode.Field);

            builder.Property(p => p.UserId)
             .IsRequired();

            builder.HasMany(p => p.SellProductHistory)
                   .WithOne()
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(p => p.Consumer)
                   .WithMany()
                   .HasForeignKey(p=>p.ConsumerId)
                   .OnDelete(DeleteBehavior.Cascade);

        }
    }
}
