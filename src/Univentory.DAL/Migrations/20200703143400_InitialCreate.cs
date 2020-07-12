using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Univentory.DAL.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "univentory");

            migrationBuilder.CreateSequence(
                name: "brandseq",
                schema: "univentory",
                incrementBy: 10);

            migrationBuilder.CreateSequence(
                name: "categoryseq",
                schema: "univentory",
                incrementBy: 10);

            migrationBuilder.CreateSequence(
                name: "consumerseq",
                schema: "univentory",
                incrementBy: 10);

            migrationBuilder.CreateSequence(
                name: "productseq",
                schema: "univentory",
                incrementBy: 10);

            migrationBuilder.CreateSequence(
                name: "sellproducthistoryseq",
                schema: "univentory",
                incrementBy: 10);

            migrationBuilder.CreateSequence(
                name: "sellproductseq",
                schema: "univentory",
                incrementBy: 10);

            migrationBuilder.CreateSequence(
                name: "userseq",
                schema: "univentory",
                incrementBy: 10);

            migrationBuilder.CreateTable(
                name: "Consumers",
                schema: "univentory",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false),
                    CreatedBy = table.Column<int>(nullable: false),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    UpdatedBy = table.Column<int>(nullable: false),
                    UpdatedDate = table.Column<DateTime>(nullable: true),
                    UserId = table.Column<int>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    Email = table.Column<string>(nullable: true),
                    MobileNumber = table.Column<string>(nullable: true),
                    BillingAddress = table.Column<string>(nullable: true),
                    IsActive = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Consumers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ProductBrands",
                schema: "univentory",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false),
                    CreatedBy = table.Column<int>(nullable: false),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    UpdatedBy = table.Column<int>(nullable: false),
                    UpdatedDate = table.Column<DateTime>(nullable: true),
                    UserId = table.Column<int>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    Description = table.Column<string>(nullable: true),
                    IsActive = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductBrands", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ProductCategories",
                schema: "univentory",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false),
                    CreatedBy = table.Column<int>(nullable: false),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    UpdatedBy = table.Column<int>(nullable: false),
                    UpdatedDate = table.Column<DateTime>(nullable: true),
                    UserId = table.Column<int>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true),
                    IsActive = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductCategories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                schema: "univentory",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false),
                    CreatedBy = table.Column<int>(nullable: false),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    UpdatedBy = table.Column<int>(nullable: false),
                    UpdatedDate = table.Column<DateTime>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    UserName = table.Column<string>(nullable: true),
                    GSTNumber = table.Column<string>(nullable: true),
                    PasswordHash = table.Column<string>(nullable: true),
                    MobileNumber = table.Column<string>(nullable: true),
                    Email = table.Column<string>(nullable: true),
                    ShopName = table.Column<string>(nullable: true),
                    Logo = table.Column<string>(nullable: true),
                    Address = table.Column<string>(nullable: true),
                    IsActive = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Vendors",
                schema: "univentory",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false),
                    CreatedBy = table.Column<int>(nullable: false),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    UpdatedBy = table.Column<int>(nullable: false),
                    UpdatedDate = table.Column<DateTime>(nullable: true),
                    UserId = table.Column<int>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    Email = table.Column<string>(nullable: true),
                    MobileNumber = table.Column<string>(nullable: true),
                    BillingAddress = table.Column<string>(nullable: true),
                    IsActive = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vendors", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SellProducts",
                schema: "univentory",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false),
                    CreatedBy = table.Column<int>(nullable: false),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    UpdatedBy = table.Column<int>(nullable: false),
                    UpdatedDate = table.Column<DateTime>(nullable: true),
                    UserId = table.Column<int>(nullable: false),
                    TotalPaid = table.Column<decimal>(nullable: false),
                    TotalPrice = table.Column<decimal>(nullable: false),
                    ConsumerId = table.Column<int>(nullable: false),
                    IsActive = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SellProducts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SellProducts_Consumers_ConsumerId",
                        column: x => x.ConsumerId,
                        principalSchema: "univentory",
                        principalTable: "Consumers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Products",
                schema: "univentory",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false),
                    CreatedBy = table.Column<int>(nullable: false),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    UpdatedBy = table.Column<int>(nullable: false),
                    UpdatedDate = table.Column<DateTime>(nullable: true),
                    UserId = table.Column<int>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    Code = table.Column<string>(nullable: true),
                    PurchasePrice = table.Column<decimal>(nullable: false),
                    SellPrice = table.Column<decimal>(nullable: false),
                    CategoryId = table.Column<int>(nullable: false),
                    BrandId = table.Column<int>(nullable: false),
                    VendorId = table.Column<int>(nullable: false),
                    Description = table.Column<string>(nullable: true),
                    TaxRateInPercentage = table.Column<decimal>(nullable: false),
                    DiscountInPercntage = table.Column<decimal>(nullable: false),
                    AvailableStock = table.Column<int>(nullable: false),
                    MaxStockThreshold = table.Column<int>(nullable: false),
                    IsActive = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Products_ProductBrands_BrandId",
                        column: x => x.BrandId,
                        principalSchema: "univentory",
                        principalTable: "ProductBrands",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Products_ProductCategories_CategoryId",
                        column: x => x.CategoryId,
                        principalSchema: "univentory",
                        principalTable: "ProductCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Products_Vendors_VendorId",
                        column: x => x.VendorId,
                        principalSchema: "univentory",
                        principalTable: "Vendors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SellProductHistories",
                schema: "univentory",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false),
                    CreatedBy = table.Column<int>(nullable: false),
                    CreatedDate = table.Column<DateTime>(nullable: true),
                    UpdatedBy = table.Column<int>(nullable: false),
                    UpdatedDate = table.Column<DateTime>(nullable: true),
                    Unit = table.Column<int>(nullable: false),
                    SalePrice = table.Column<decimal>(nullable: false),
                    Descrption = table.Column<string>(nullable: true),
                    TaxRateInPercentage = table.Column<decimal>(nullable: false),
                    DiscountInPercntage = table.Column<decimal>(nullable: false),
                    ProductId = table.Column<int>(nullable: false),
                    IsActive = table.Column<bool>(nullable: false),
                    SellProductId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SellProductHistories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SellProductHistories_Products_ProductId",
                        column: x => x.ProductId,
                        principalSchema: "univentory",
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SellProductHistories_SellProducts_SellProductId",
                        column: x => x.SellProductId,
                        principalSchema: "univentory",
                        principalTable: "SellProducts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Products_BrandId",
                schema: "univentory",
                table: "Products",
                column: "BrandId");

            migrationBuilder.CreateIndex(
                name: "IX_Products_CategoryId",
                schema: "univentory",
                table: "Products",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Products_VendorId",
                schema: "univentory",
                table: "Products",
                column: "VendorId");

            migrationBuilder.CreateIndex(
                name: "IX_SellProductHistories_ProductId",
                schema: "univentory",
                table: "SellProductHistories",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_SellProductHistories_SellProductId",
                schema: "univentory",
                table: "SellProductHistories",
                column: "SellProductId");

            migrationBuilder.CreateIndex(
                name: "IX_SellProducts_ConsumerId",
                schema: "univentory",
                table: "SellProducts",
                column: "ConsumerId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SellProductHistories",
                schema: "univentory");

            migrationBuilder.DropTable(
                name: "Users",
                schema: "univentory");

            migrationBuilder.DropTable(
                name: "Products",
                schema: "univentory");

            migrationBuilder.DropTable(
                name: "SellProducts",
                schema: "univentory");

            migrationBuilder.DropTable(
                name: "ProductBrands",
                schema: "univentory");

            migrationBuilder.DropTable(
                name: "ProductCategories",
                schema: "univentory");

            migrationBuilder.DropTable(
                name: "Vendors",
                schema: "univentory");

            migrationBuilder.DropTable(
                name: "Consumers",
                schema: "univentory");

            migrationBuilder.DropSequence(
                name: "brandseq",
                schema: "univentory");

            migrationBuilder.DropSequence(
                name: "categoryseq",
                schema: "univentory");

            migrationBuilder.DropSequence(
                name: "consumerseq",
                schema: "univentory");

            migrationBuilder.DropSequence(
                name: "productseq",
                schema: "univentory");

            migrationBuilder.DropSequence(
                name: "sellproducthistoryseq",
                schema: "univentory");

            migrationBuilder.DropSequence(
                name: "sellproductseq",
                schema: "univentory");

            migrationBuilder.DropSequence(
                name: "userseq",
                schema: "univentory");
        }
    }
}
