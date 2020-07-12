using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;
using Univentory.Domain.entities;

namespace Univentory.DAL.EFTypeConfigurations
{
    public class UserEntityTypeConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("Users", UniventoryContext.DEFAULT_SCHEMA);

            builder.HasKey(p => p.Id);

            builder.Property(p => p.Id)
                   .UseHiLo("userseq", UniventoryContext.DEFAULT_SCHEMA);

        }
    }
}
