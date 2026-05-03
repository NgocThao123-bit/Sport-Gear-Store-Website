using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SportGearStore.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SwitchToJpgImages : Migration
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
                value: "https://e7.pngegg.com/pngimages/57/51/png-clipart-t-shirt-dri-fit-nike-clothing-t-shirt-tshirt-white.png");

            migrationBuilder.UpdateData(
                table: "ProductImages",
                keyColumn: "Id",
                keyValue: new Guid("cccc0002-0000-0000-0000-000000000000"),
                column: "ImageUrl",
                value: "https://e7.pngegg.com/pngimages/49/239/png-clipart-gym-shorts-adidas-t-shirt-pants-shorts-sport-fashion.png");

            migrationBuilder.UpdateData(
                table: "ProductImages",
                keyColumn: "Id",
                keyValue: new Guid("cccc0003-0000-0000-0000-000000000000"),
                column: "ImageUrl",
                value: "https://e7.pngegg.com/pngimages/825/233/png-clipart-sleeve-under-armour-coldgear-armour-twist-compression-mens-long-shirt-taylormade-golf-balls-55-tshirt-running.png");

            migrationBuilder.UpdateData(
                table: "ProductImages",
                keyColumn: "Id",
                keyValue: new Guid("cccc0004-0000-0000-0000-000000000000"),
                column: "ImageUrl",
                value: "https://e7.pngegg.com/pngimages/705/77/png-clipart-nike-air-zoom-pegasus-35-men-s-nike-air-zoom-pegasus-35-women-s-sports-shoes-nike-pegasus.png");

            migrationBuilder.UpdateData(
                table: "ProductImages",
                keyColumn: "Id",
                keyValue: new Guid("cccc0005-0000-0000-0000-000000000000"),
                column: "ImageUrl",
                value: "https://e7.pngegg.com/pngimages/284/613/png-clipart-adidas-predator-adidas-originals-cleat-football-adidas-football-boot-logo.png");

            migrationBuilder.UpdateData(
                table: "ProductImages",
                keyColumn: "Id",
                keyValue: new Guid("cccc0006-0000-0000-0000-000000000000"),
                column: "ImageUrl",
                value: "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5781.png");

            migrationBuilder.UpdateData(
                table: "ProductImages",
                keyColumn: "Id",
                keyValue: new Guid("cccc0007-0000-0000-0000-000000000000"),
                column: "ImageUrl",
                value: "https://e7.pngegg.com/pngimages/1010/886/png-clipart-nike-strike-soccer-ball-football-nike-men-s-aeroswift-strike-short-black-ball.png");

            migrationBuilder.UpdateData(
                table: "ProductImages",
                keyColumn: "Id",
                keyValue: new Guid("cccc0008-0000-0000-0000-000000000000"),
                column: "ImageUrl",
                value: "https://e7.pngegg.com/pngimages/452/981/png-clipart-spalding-nba-official-game-basketball-spalding-nba-official-game-basketball-spalding-nba-official-game-basketball-under-armour-backpack-coloring-pages-sports-nba.png");

            migrationBuilder.UpdateData(
                table: "ProductImages",
                keyColumn: "Id",
                keyValue: new Guid("cccc0009-0000-0000-0000-000000000000"),
                column: "ImageUrl",
                value: "https://e7.pngegg.com/pngimages/439/541/png-clipart-badmintonracket-yonex-shuttlecock-badminton-racket-sport-sporting-goods.png");
        }
    }
}
