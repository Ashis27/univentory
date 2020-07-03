using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;
using Univentory.Domain.entities;

namespace Univentory.DAL.EFTypeConfigurations
{
    public class SellProductHistoryEntityTypeConfiguration : IEntityTypeConfiguration<SellProductHistory>
    {
        public void Configure(EntityTypeBuilder<SellProductHistory> builder)
        {
            builder.ToTable("SellProductHistories", UniventoryContext.DEFAULT_SCHEMA);

            builder.HasKey(p => p.Id);

            builder.Property(p => p.Id)
                   .UseHiLo("sellproducthistoryseq", UniventoryContext.DEFAULT_SCHEMA);

            builder.Property(p => p.Descrption)
                      .IsRequired(false);

            builder.HasOne(p => p.Product)
                   .WithMany()
                   .HasForeignKey(p=>p.ProductId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
