using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SportGearStore.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SeedProductData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"));

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"));

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"));

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("44444444-4444-4444-4444-444444444444"));

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("55555555-5555-5555-5555-555555555555"));

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "CreatedAt", "Description", "ImageUrl", "IsActive", "Name", "Slug", "UpdatedAt" },
                values: new object[,]
                {
                    { new Guid("aaaa0001-0000-0000-0000-000000000000"), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Sports apparel — jerseys, shorts, jackets and compression wear.", null, true, "Clothing", "clothing", null },
                    { new Guid("aaaa0002-0000-0000-0000-000000000000"), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Sports shoes for running, football, basketball, tennis and more.", null, true, "Footwear", "footwear", null },
                    { new Guid("aaaa0003-0000-0000-0000-000000000000"), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Sports equipment — balls, rackets, nets and protective gear.", null, true, "Equipment", "equipment", null }
                });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "Brand", "CategoryId", "CreatedAt", "Description", "IsActive", "Name", "Price", "SalePrice", "Slug", "UpdatedAt" },
                values: new object[,]
                {
                    { new Guid("bbbb0001-0000-0000-0000-000000000000"), "Nike", new Guid("aaaa0001-0000-0000-0000-000000000000"), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Lightweight, sweat-wicking Dri-FIT fabric keeps you dry and comfortable during intense training sessions.", true, "Nike Dri-FIT Training T-Shirt", 29.99m, null, "nike-dri-fit-training-tshirt", null },
                    { new Guid("bbbb0002-0000-0000-0000-000000000000"), "Adidas", new Guid("aaaa0001-0000-0000-0000-000000000000"), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Classic Adidas shorts with iconic 3-stripes design. Elastic waistband with drawcord for a secure fit.", true, "Adidas Essentials 3-Stripes Shorts", 34.99m, 27.99m, "adidas-essentials-3-stripes-shorts", null },
                    { new Guid("bbbb0003-0000-0000-0000-000000000000"), "Under Armour", new Guid("aaaa0001-0000-0000-0000-000000000000"), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "ColdGear technology traps heat without bulk. Reflective details for low-light visibility. Zip pockets for secure storage.", true, "Under Armour ColdGear Running Jacket", 89.99m, null, "under-armour-coldgear-running-jacket", null },
                    { new Guid("bbbb0004-0000-0000-0000-000000000000"), "Nike", new Guid("aaaa0002-0000-0000-0000-000000000000"), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "The iconic running shoe is back. Air Zoom unit delivers a springy, responsive ride on every run.", true, "Nike Air Zoom Pegasus 40", 130.00m, null, "nike-air-zoom-pegasus-40", null },
                    { new Guid("bbbb0005-0000-0000-0000-000000000000"), "Adidas", new Guid("aaaa0002-0000-0000-0000-000000000000"), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Control-zone texture on the upper increases friction on the ball for precise passing and devastating shots.", true, "Adidas Predator Accuracy Football Boots", 159.99m, 129.99m, "adidas-predator-accuracy-football-boots", null },
                    { new Guid("bbbb0006-0000-0000-0000-000000000000"), "Asics", new Guid("aaaa0002-0000-0000-0000-000000000000"), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Maximum cushioning with GEL technology for long-distance runs. FF BLAST PLUS ECO midsole provides a soft, responsive bounce.", true, "Asics Gel-Nimbus 25 Running Shoes", 149.99m, null, "asics-gel-nimbus-25-running-shoes", null },
                    { new Guid("bbbb0007-0000-0000-0000-000000000000"), "Nike", new Guid("aaaa0003-0000-0000-0000-000000000000"), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "High-visibility design with a textured casing for better grip and ball control in all conditions.", true, "Nike Strike Football", 34.99m, null, "nike-strike-football", null },
                    { new Guid("bbbb0008-0000-0000-0000-000000000000"), "Spalding", new Guid("aaaa0003-0000-0000-0000-000000000000"), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Official NBA game ball. Full-grain leather construction for superior feel and control.", true, "Spalding NBA Official Game Basketball", 179.99m, 149.99m, "spalding-nba-official-game-basketball", null },
                    { new Guid("bbbb0009-0000-0000-0000-000000000000"), "Yonex", new Guid("aaaa0003-0000-0000-0000-000000000000"), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Rotational Generator System for steep angle attacking shots. Nanomesh Neo + Carbon Nanotube construction.", true, "Yonex Astrox 88S Badminton Racket", 199.99m, null, "yonex-astrox-88s-badminton-racket", null }
                });

            migrationBuilder.InsertData(
                table: "ProductImages",
                columns: new[] { "Id", "CreatedAt", "DisplayOrder", "ImageUrl", "IsMain", "ProductId", "UpdatedAt" },
                values: new object[,]
                {
                    { new Guid("cccc0001-0000-0000-0000-000000000000"), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, "https://picsum.photos/seed/nike-dri-fit-tshirt/600/600", true, new Guid("bbbb0001-0000-0000-0000-000000000000"), null },
                    { new Guid("cccc0002-0000-0000-0000-000000000000"), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, "https://picsum.photos/seed/adidas-essentials-shorts/600/600", true, new Guid("bbbb0002-0000-0000-0000-000000000000"), null },
                    { new Guid("cccc0003-0000-0000-0000-000000000000"), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, "https://picsum.photos/seed/ua-coldgear-jacket/600/600", true, new Guid("bbbb0003-0000-0000-0000-000000000000"), null },
                    { new Guid("cccc0004-0000-0000-0000-000000000000"), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, "https://picsum.photos/seed/nike-air-zoom-pegasus/600/600", true, new Guid("bbbb0004-0000-0000-0000-000000000000"), null },
                    { new Guid("cccc0005-0000-0000-0000-000000000000"), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, "https://picsum.photos/seed/adidas-predator-boots/600/600", true, new Guid("bbbb0005-0000-0000-0000-000000000000"), null },
                    { new Guid("cccc0006-0000-0000-0000-000000000000"), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, "https://picsum.photos/seed/asics-gel-nimbus-25/600/600", true, new Guid("bbbb0006-0000-0000-0000-000000000000"), null },
                    { new Guid("cccc0007-0000-0000-0000-000000000000"), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, "https://picsum.photos/seed/nike-strike-football/600/600", true, new Guid("bbbb0007-0000-0000-0000-000000000000"), null },
                    { new Guid("cccc0008-0000-0000-0000-000000000000"), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, "https://picsum.photos/seed/spalding-nba-basketball/600/600", true, new Guid("bbbb0008-0000-0000-0000-000000000000"), null },
                    { new Guid("cccc0009-0000-0000-0000-000000000000"), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, "https://picsum.photos/seed/yonex-astrox-badminton-racket/600/600", true, new Guid("bbbb0009-0000-0000-0000-000000000000"), null }
                });

            migrationBuilder.InsertData(
                table: "ProductVariants",
                columns: new[] { "Id", "Color", "CreatedAt", "ExtraPrice", "ProductId", "Size", "Stock", "UpdatedAt" },
                values: new object[,]
                {
                    { new Guid("dddd0001-0000-0000-0000-000000000000"), "Black", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, new Guid("bbbb0001-0000-0000-0000-000000000000"), "S", 20, null },
                    { new Guid("dddd0002-0000-0000-0000-000000000000"), "Black", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, new Guid("bbbb0001-0000-0000-0000-000000000000"), "M", 35, null },
                    { new Guid("dddd0003-0000-0000-0000-000000000000"), "Black", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, new Guid("bbbb0001-0000-0000-0000-000000000000"), "L", 30, null },
                    { new Guid("dddd0004-0000-0000-0000-000000000000"), "Black", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, new Guid("bbbb0001-0000-0000-0000-000000000000"), "XL", 15, null },
                    { new Guid("dddd0005-0000-0000-0000-000000000000"), "White", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, new Guid("bbbb0001-0000-0000-0000-000000000000"), "M", 25, null },
                    { new Guid("dddd0006-0000-0000-0000-000000000000"), "White", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, new Guid("bbbb0001-0000-0000-0000-000000000000"), "L", 20, null },
                    { new Guid("dddd0007-0000-0000-0000-000000000000"), "Black", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, new Guid("bbbb0002-0000-0000-0000-000000000000"), "S", 18, null },
                    { new Guid("dddd0008-0000-0000-0000-000000000000"), "Black", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, new Guid("bbbb0002-0000-0000-0000-000000000000"), "M", 30, null },
                    { new Guid("dddd0009-0000-0000-0000-000000000000"), "Black", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, new Guid("bbbb0002-0000-0000-0000-000000000000"), "L", 25, null },
                    { new Guid("dddd0010-0000-0000-0000-000000000000"), "Black", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, new Guid("bbbb0002-0000-0000-0000-000000000000"), "XL", 12, null },
                    { new Guid("dddd0011-0000-0000-0000-000000000000"), "Navy", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, new Guid("bbbb0002-0000-0000-0000-000000000000"), "M", 20, null },
                    { new Guid("dddd0012-0000-0000-0000-000000000000"), "Navy", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, new Guid("bbbb0002-0000-0000-0000-000000000000"), "L", 18, null },
                    { new Guid("dddd0013-0000-0000-0000-000000000000"), "Black", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, new Guid("bbbb0003-0000-0000-0000-000000000000"), "S", 10, null },
                    { new Guid("dddd0014-0000-0000-0000-000000000000"), "Black", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, new Guid("bbbb0003-0000-0000-0000-000000000000"), "M", 20, null },
                    { new Guid("dddd0015-0000-0000-0000-000000000000"), "Black", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, new Guid("bbbb0003-0000-0000-0000-000000000000"), "L", 18, null },
                    { new Guid("dddd0016-0000-0000-0000-000000000000"), "Black", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 5.00m, new Guid("bbbb0003-0000-0000-0000-000000000000"), "XL", 8, null },
                    { new Guid("dddd0017-0000-0000-0000-000000000000"), "Red", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, new Guid("bbbb0003-0000-0000-0000-000000000000"), "M", 12, null },
                    { new Guid("dddd0018-0000-0000-0000-000000000000"), "Red", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, new Guid("bbbb0003-0000-0000-0000-000000000000"), "L", 10, null },
                    { new Guid("dddd0019-0000-0000-0000-000000000000"), "White/Black", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, new Guid("bbbb0004-0000-0000-0000-000000000000"), "39", 8, null },
                    { new Guid("dddd0020-0000-0000-0000-000000000000"), "White/Black", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, new Guid("bbbb0004-0000-0000-0000-000000000000"), "40", 15, null },
                    { new Guid("dddd0021-0000-0000-0000-000000000000"), "White/Black", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, new Guid("bbbb0004-0000-0000-0000-000000000000"), "41", 20, null },
                    { new Guid("dddd0022-0000-0000-0000-000000000000"), "White/Black", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, new Guid("bbbb0004-0000-0000-0000-000000000000"), "42", 18, null },
                    { new Guid("dddd0023-0000-0000-0000-000000000000"), "White/Black", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, new Guid("bbbb0004-0000-0000-0000-000000000000"), "43", 12, null },
                    { new Guid("dddd0024-0000-0000-0000-000000000000"), "White/Black", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, new Guid("bbbb0004-0000-0000-0000-000000000000"), "44", 6, null },
                    { new Guid("dddd0025-0000-0000-0000-000000000000"), "Black/Red", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, new Guid("bbbb0005-0000-0000-0000-000000000000"), "39", 6, null },
                    { new Guid("dddd0026-0000-0000-0000-000000000000"), "Black/Red", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, new Guid("bbbb0005-0000-0000-0000-000000000000"), "40", 10, null },
                    { new Guid("dddd0027-0000-0000-0000-000000000000"), "Black/Red", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, new Guid("bbbb0005-0000-0000-0000-000000000000"), "41", 14, null },
                    { new Guid("dddd0028-0000-0000-0000-000000000000"), "Black/Red", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, new Guid("bbbb0005-0000-0000-0000-000000000000"), "42", 16, null },
                    { new Guid("dddd0029-0000-0000-0000-000000000000"), "Black/Red", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, new Guid("bbbb0005-0000-0000-0000-000000000000"), "43", 10, null },
                    { new Guid("dddd0030-0000-0000-0000-000000000000"), "Black/Red", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, new Guid("bbbb0005-0000-0000-0000-000000000000"), "44", 5, null },
                    { new Guid("dddd0031-0000-0000-0000-000000000000"), "Blue/Silver", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, new Guid("bbbb0006-0000-0000-0000-000000000000"), "39", 7, null },
                    { new Guid("dddd0032-0000-0000-0000-000000000000"), "Blue/Silver", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, new Guid("bbbb0006-0000-0000-0000-000000000000"), "40", 12, null },
                    { new Guid("dddd0033-0000-0000-0000-000000000000"), "Blue/Silver", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, new Guid("bbbb0006-0000-0000-0000-000000000000"), "41", 18, null },
                    { new Guid("dddd0034-0000-0000-0000-000000000000"), "Blue/Silver", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, new Guid("bbbb0006-0000-0000-0000-000000000000"), "42", 15, null },
                    { new Guid("dddd0035-0000-0000-0000-000000000000"), "Blue/Silver", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, new Guid("bbbb0006-0000-0000-0000-000000000000"), "43", 9, null },
                    { new Guid("dddd0036-0000-0000-0000-000000000000"), "Blue/Silver", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, new Guid("bbbb0006-0000-0000-0000-000000000000"), "44", 4, null },
                    { new Guid("dddd0037-0000-0000-0000-000000000000"), null, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, new Guid("bbbb0007-0000-0000-0000-000000000000"), "4", 25, null },
                    { new Guid("dddd0038-0000-0000-0000-000000000000"), null, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 5.00m, new Guid("bbbb0007-0000-0000-0000-000000000000"), "5", 40, null },
                    { new Guid("dddd0039-0000-0000-0000-000000000000"), null, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), -20.00m, new Guid("bbbb0008-0000-0000-0000-000000000000"), "5 (Youth)", 15, null },
                    { new Guid("dddd0040-0000-0000-0000-000000000000"), null, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, new Guid("bbbb0008-0000-0000-0000-000000000000"), "7 (Official)", 30, null },
                    { new Guid("dddd0041-0000-0000-0000-000000000000"), "Black/Silver", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, new Guid("bbbb0009-0000-0000-0000-000000000000"), "3U", 12, null },
                    { new Guid("dddd0042-0000-0000-0000-000000000000"), "Black/Silver", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), -10.00m, new Guid("bbbb0009-0000-0000-0000-000000000000"), "4U", 15, null }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ProductImages",
                keyColumn: "Id",
                keyValue: new Guid("cccc0001-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "ProductImages",
                keyColumn: "Id",
                keyValue: new Guid("cccc0002-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "ProductImages",
                keyColumn: "Id",
                keyValue: new Guid("cccc0003-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "ProductImages",
                keyColumn: "Id",
                keyValue: new Guid("cccc0004-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "ProductImages",
                keyColumn: "Id",
                keyValue: new Guid("cccc0005-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "ProductImages",
                keyColumn: "Id",
                keyValue: new Guid("cccc0006-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "ProductImages",
                keyColumn: "Id",
                keyValue: new Guid("cccc0007-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "ProductImages",
                keyColumn: "Id",
                keyValue: new Guid("cccc0008-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "ProductImages",
                keyColumn: "Id",
                keyValue: new Guid("cccc0009-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "ProductVariants",
                keyColumn: "Id",
                keyValue: new Guid("dddd0001-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "ProductVariants",
                keyColumn: "Id",
                keyValue: new Guid("dddd0002-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "ProductVariants",
                keyColumn: "Id",
                keyValue: new Guid("dddd0003-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "ProductVariants",
                keyColumn: "Id",
                keyValue: new Guid("dddd0004-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "ProductVariants",
                keyColumn: "Id",
                keyValue: new Guid("dddd0005-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "ProductVariants",
                keyColumn: "Id",
                keyValue: new Guid("dddd0006-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "ProductVariants",
                keyColumn: "Id",
                keyValue: new Guid("dddd0007-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "ProductVariants",
                keyColumn: "Id",
                keyValue: new Guid("dddd0008-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "ProductVariants",
                keyColumn: "Id",
                keyValue: new Guid("dddd0009-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "ProductVariants",
                keyColumn: "Id",
                keyValue: new Guid("dddd0010-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "ProductVariants",
                keyColumn: "Id",
                keyValue: new Guid("dddd0011-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "ProductVariants",
                keyColumn: "Id",
                keyValue: new Guid("dddd0012-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "ProductVariants",
                keyColumn: "Id",
                keyValue: new Guid("dddd0013-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "ProductVariants",
                keyColumn: "Id",
                keyValue: new Guid("dddd0014-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "ProductVariants",
                keyColumn: "Id",
                keyValue: new Guid("dddd0015-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "ProductVariants",
                keyColumn: "Id",
                keyValue: new Guid("dddd0016-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "ProductVariants",
                keyColumn: "Id",
                keyValue: new Guid("dddd0017-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "ProductVariants",
                keyColumn: "Id",
                keyValue: new Guid("dddd0018-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "ProductVariants",
                keyColumn: "Id",
                keyValue: new Guid("dddd0019-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "ProductVariants",
                keyColumn: "Id",
                keyValue: new Guid("dddd0020-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "ProductVariants",
                keyColumn: "Id",
                keyValue: new Guid("dddd0021-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "ProductVariants",
                keyColumn: "Id",
                keyValue: new Guid("dddd0022-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "ProductVariants",
                keyColumn: "Id",
                keyValue: new Guid("dddd0023-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "ProductVariants",
                keyColumn: "Id",
                keyValue: new Guid("dddd0024-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "ProductVariants",
                keyColumn: "Id",
                keyValue: new Guid("dddd0025-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "ProductVariants",
                keyColumn: "Id",
                keyValue: new Guid("dddd0026-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "ProductVariants",
                keyColumn: "Id",
                keyValue: new Guid("dddd0027-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "ProductVariants",
                keyColumn: "Id",
                keyValue: new Guid("dddd0028-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "ProductVariants",
                keyColumn: "Id",
                keyValue: new Guid("dddd0029-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "ProductVariants",
                keyColumn: "Id",
                keyValue: new Guid("dddd0030-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "ProductVariants",
                keyColumn: "Id",
                keyValue: new Guid("dddd0031-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "ProductVariants",
                keyColumn: "Id",
                keyValue: new Guid("dddd0032-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "ProductVariants",
                keyColumn: "Id",
                keyValue: new Guid("dddd0033-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "ProductVariants",
                keyColumn: "Id",
                keyValue: new Guid("dddd0034-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "ProductVariants",
                keyColumn: "Id",
                keyValue: new Guid("dddd0035-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "ProductVariants",
                keyColumn: "Id",
                keyValue: new Guid("dddd0036-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "ProductVariants",
                keyColumn: "Id",
                keyValue: new Guid("dddd0037-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "ProductVariants",
                keyColumn: "Id",
                keyValue: new Guid("dddd0038-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "ProductVariants",
                keyColumn: "Id",
                keyValue: new Guid("dddd0039-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "ProductVariants",
                keyColumn: "Id",
                keyValue: new Guid("dddd0040-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "ProductVariants",
                keyColumn: "Id",
                keyValue: new Guid("dddd0041-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "ProductVariants",
                keyColumn: "Id",
                keyValue: new Guid("dddd0042-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: new Guid("bbbb0001-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: new Guid("bbbb0002-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: new Guid("bbbb0003-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: new Guid("bbbb0004-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: new Guid("bbbb0005-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: new Guid("bbbb0006-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: new Guid("bbbb0007-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: new Guid("bbbb0008-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: new Guid("bbbb0009-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("aaaa0001-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("aaaa0002-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("aaaa0003-0000-0000-0000-000000000000"));

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "CreatedAt", "Description", "ImageUrl", "IsActive", "Name", "Slug", "UpdatedAt" },
                values: new object[,]
                {
                    { new Guid("11111111-1111-1111-1111-111111111111"), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, true, "Running", "running", null },
                    { new Guid("22222222-2222-2222-2222-222222222222"), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, true, "Cycling", "cycling", null },
                    { new Guid("33333333-3333-3333-3333-333333333333"), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, true, "Football", "football", null },
                    { new Guid("44444444-4444-4444-4444-444444444444"), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, true, "Basketball", "basketball", null },
                    { new Guid("55555555-5555-5555-5555-555555555555"), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, true, "Swimming", "swimming", null }
                });
        }
    }
}
