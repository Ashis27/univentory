using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using MyShop.Identity.Infrastructure.Services;
using Univentory.Common.filters;
using Univentory.DAL;
using Univentory.DAL.interfaces;
using Univentory.DAL.repositories;
using Univentory.Domain.entities;
using Univentory.Services.Helpers;
using Univentory.Services.interfaces;
using Univentory.Services.services;

namespace Univentory.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //JWT authentication configuration
            services.AddJwtAuthentication(Configuration);

            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

            services.AddCustomMvc()
                    .AddCustomDbContext(Configuration)
                    .AddCustomDIIntegrations()
                    .AddControllers();

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseCors("CorsPolicy");

            app.UseSwagger();

            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Univentory API V1");
            });

            app.UseRouting();

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
    public static class CustomExtensionMethods
    {
        public static IServiceCollection AddCustomMvc(this IServiceCollection services)
        {
            // Add framework services.
            services.AddMvc(options =>
            {
                options.Filters.Add(typeof(HttpGlobalExceptionFilter));
            })
                .SetCompatibilityVersion(CompatibilityVersion.Version_3_0)
                .AddControllersAsServices();  //Injecting Controllers themselves thru DI
                                              //For further info see: http://docs.autofac.org/en/latest/integration/aspnetcore.html#controllers-as-services

            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                    builder => builder
                    .SetIsOriginAllowed((host) => true)
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials());
            });

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Version = "v1",
                    Title = "Univentory API",
                    Description = "Univentory ASP.NET Core Web API",
                    //TermsOfService = new Uri("https://example.com/terms"),
                    Contact = new OpenApiContact
                    {
                        Name = "Ashis Mahapatra",
                        Email = "ashish.mahapatra1991@gmail.com",
                        Url = new Uri("https://www.zedotech.com"),
                    },
                    //License = new OpenApiLicense
                    //{
                    //    Name = "Use under LICX",
                    //    Url = new Uri("https://example.com/license"),
                    //}
                });
            });

            return services;
        }

        public static IServiceCollection AddCustomDbContext(this IServiceCollection services, IConfiguration configuration)
        {
            bool isSQLServerEnabled = configuration.GetValue<bool>("SQLServerEnabled");
            services.AddDbContext<UniventoryContext>(options =>
            {
                if (isSQLServerEnabled)
                {
                    options.UseSqlServer(configuration["ConnectionString"],
                                    sqlServerOptionsAction: sqlOptions =>
                                    {
                                        sqlOptions.MigrationsAssembly("Univentory.DAL");
                                        //Configuring Connection Resiliency
                                        sqlOptions.EnableRetryOnFailure(maxRetryCount: 10, maxRetryDelay: TimeSpan.FromSeconds(30), errorNumbersToAdd: null);
                                    });
                }
                else
                {
                    options.UseSqlite(configuration["ConnectionString"],
                                                       sqliteOptionsAction: sqlOptions =>
                                                       {
                                                           sqlOptions.MigrationsAssembly(typeof(Startup).GetTypeInfo().Assembly.GetName().Name);
                                                           //Configuring Connection Resiliency
                                                           //sqlOptions.EnableRetryOnFailure(maxRetryCount: 10, maxRetryDelay: TimeSpan.FromSeconds(30), errorNumbersToAdd: null);
                                                       });
                }
            });

            return services;
        }

        public static IServiceCollection AddCustomDIIntegrations(this IServiceCollection services)
        {
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddTransient<IBrandService, BrandService>();
            services.AddTransient<IUserService, UserService>();
            services.AddTransient<IProductService, ProductService>();
            services.AddTransient<ICategoryService, CategoryService>();
            services.AddTransient<IJwtAuthServices, JwtAuthService>();
            services.AddTransient<IBrandRepository, BrandRepository>();
            services.AddTransient<IUserRepository, UserRepository>();
            services.AddTransient<ICategoryRepository, CategoryRepository>();
            services.AddTransient<IProductRepository, ProductRepository>();
            services.AddTransient<IProductSellService, SellProductService>();
            services.AddTransient<IProductSellRepository, ProductSellRepository>();
            services.AddSingleton<IPasswordHasher<User>, PasswordHasher<User>>();

            return services;
        }
    }
}
