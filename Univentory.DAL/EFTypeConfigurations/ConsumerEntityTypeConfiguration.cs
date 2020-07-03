using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;
using Univentory.Domain.entities;

namespace Univentory.DAL.EFTypeConfigurations
{
    public class ConsumerEntityTypeConfiguration : IEntityTypeConfiguration<Consumer>
    {
        public void Configure(EntityTypeBuilder<Consumer> builder)
        {
            builder.ToTable("Consumers", UniventoryContext.DEFAULT_SCHEMA);

            builder.HasKey(p => p.Id);

            builder.Property(p => p.Id)
                   .UseHiLo("consumerseq", UniventoryContext.DEFAULT_SCHEMA);

            builder.Property(p => p.UserId)
             .IsRequired();

            builder.Property(p => p.MobileNumber)
                   .IsRequired(false);

            builder.Property(p => p.Email)
                   .IsRequired(false);

            builder.Property(p => p.BillingAddress)
                   .IsRequired(false);
        }
    }
}
