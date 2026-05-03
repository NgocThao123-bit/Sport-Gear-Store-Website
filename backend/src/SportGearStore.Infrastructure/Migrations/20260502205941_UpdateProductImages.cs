using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SportGearStore.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateProductImages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "ProductImages",
                keyColumn: "Id",
                keyValue: new Guid("cccc0001-0000-0000-0000-000000000000"),
                column: "ImageUrl",
                value: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop&q=80");

            migrationBuilder.UpdateData(
                table: "ProductImages",
                keyColumn: "Id",
                keyValue: new Guid("cccc0002-0000-0000-0000-000000000000"),
                column: "ImageUrl",
                value: "https://images.unsplash.com/photo-1591348278863-a8fb3887e2aa?w=600&h=600&fit=crop&q=80");

            migrationBuilder.UpdateData(
                table: "ProductImages",
                keyColumn: "Id",
                keyValue: new Guid("cccc0003-0000-0000-0000-000000000000"),
                column: "ImageUrl",
                value: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=600&fit=crop&q=80");

            migrationBuilder.UpdateData(
                table: "ProductImages",
                keyColumn: "Id",
                keyValue: new Guid("cccc0004-0000-0000-0000-000000000000"),
                column: "ImageUrl",
                value: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop&q=80");

            migrationBuilder.UpdateData(
                table: "ProductImages",
                keyColumn: "Id",
                keyValue: new Guid("cccc0005-0000-0000-0000-000000000000"),
                column: "ImageUrl",
                value: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&h=600&fit=crop&q=80");

            migrationBuilder.UpdateData(
                table: "ProductImages",
                keyColumn: "Id",
                keyValue: new Guid("cccc0006-0000-0000-0000-000000000000"),
                column: "ImageUrl",
                value: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&h=600&fit=crop&q=80");

            migrationBuilder.UpdateData(
                table: "ProductImages",
                keyColumn: "Id",
                keyValue: new Guid("cccc0007-0000-0000-0000-000000000000"),
                column: "ImageUrl",
                value: "https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?w=600&h=600&fit=crop&q=80");

            migrationBuilder.UpdateData(
                table: "ProductImages",
                keyColumn: "Id",
                keyValue: new Guid("cccc0008-0000-0000-0000-000000000000"),
                column: "ImageUrl",
                value: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=600&fit=crop&q=80");

            migrationBuilder.UpdateData(
                table: "ProductImages",
                keyColumn: "Id",
                keyValue: new Guid("cccc0009-0000-0000-0000-000000000000"),
                column: "ImageUrl",
                value: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&h=600&fit=crop&q=80");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "ProductImages",
                keyColumn: "Id",
                keyValue: new Guid("cccc0001-0000-0000-0000-000000000000"),
                column: "ImageUrl",
                value: "https://picsum.photos/seed/nike-dri-fit-tshirt/600/600");

            migrationBuilder.UpdateData(
                table: "ProductImages",
                keyColumn: "Id",
                keyValue: new Guid("cccc0002-0000-0000-0000-000000000000"),
                column: "ImageUrl",
                value: "https://picsum.photos/seed/adidas-essentials-shorts/600/600");

            migrationBuilder.UpdateData(
                table: "ProductImages",
                keyColumn: "Id",
                keyValue: new Guid("cccc0003-0000-0000-0000-000000000000"),
                column: "ImageUrl",
                value: "https://picsum.photos/seed/ua-coldgear-jacket/600/600");

            migrationBuilder.UpdateData(
                table: "ProductImages",
                keyColumn: "Id",
                keyValue: new Guid("cccc0004-0000-0000-0000-000000000000"),
                column: "ImageUrl",
                value: "https://picsum.photos/seed/nike-air-zoom-pegasus/600/600");

            migrationBuilder.UpdateData(
                table: "ProductImages",
                keyColumn: "Id",
                keyValue: new Guid("cccc0005-0000-0000-0000-000000000000"),
                column: "ImageUrl",
                value: "https://picsum.photos/seed/adidas-predator-boots/600/600");

            migrationBuilder.UpdateData(
                table: "ProductImages",
                keyColumn: "Id",
                keyValue: new Guid("cccc0006-0000-0000-0000-000000000000"),
                column: "ImageUrl",
                value: "https://picsum.photos/seed/asics-gel-nimbus-25/600/600");

            migrationBuilder.UpdateData(
                table: "ProductImages",
                keyColumn: "Id",
                keyValue: new Guid("cccc0007-0000-0000-0000-000000000000"),
                column: "ImageUrl",
                value: "https://picsum.photos/seed/nike-strike-football/600/600");

            migrationBuilder.UpdateData(
                table: "ProductImages",
                keyColumn: "Id",
                keyValue: new Guid("cccc0008-0000-0000-0000-000000000000"),
                column: "ImageUrl",
                value: "https://picsum.photos/seed/spalding-nba-basketball/600/600");

            migrationBuilder.UpdateData(
                table: "ProductImages",
                keyColumn: "Id",
                keyValue: new Guid("cccc0009-0000-0000-0000-000000000000"),
                column: "ImageUrl",
                value: "https://picsum.photos/seed/yonex-astrox-badminton-racket/600/600");
        }
    }
}
