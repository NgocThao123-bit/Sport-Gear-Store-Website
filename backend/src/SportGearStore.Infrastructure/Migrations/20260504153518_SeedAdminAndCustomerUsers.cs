using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SportGearStore.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SeedAdminAndCustomerUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "CreatedAt", "Email", "FirstName", "IsActive", "LastName", "PasswordHash", "Phone", "UpdatedAt" },
                values: new object[,]
                {
                    { new Guid("eeee0001-0000-0000-0000-000000000000"), null, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "admin@sportgear.com", "Admin", true, "SportGear", "$2a$11$78w0v1RHb2LhBcPH9fHn6.mxdX6DAqrwZCh3fR9/CWjsf0xQ.LyAW", null, null },
                    { new Guid("eeee0002-0000-0000-0000-000000000000"), null, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "customer@example.com", "Test", true, "Customer", "$2a$11$RRhUAvR6wylzCNkpDzr4FOLpdLBnch1Aonu1YXcBz68gUbYA3CG2e", null, null }
                });

            migrationBuilder.InsertData(
                table: "UserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[,]
                {
                    { 2, new Guid("eeee0001-0000-0000-0000-000000000000") },
                    { 1, new Guid("eeee0002-0000-0000-0000-000000000000") }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "UserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { 2, new Guid("eeee0001-0000-0000-0000-000000000000") });

            migrationBuilder.DeleteData(
                table: "UserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { 1, new Guid("eeee0002-0000-0000-0000-000000000000") });

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("eeee0001-0000-0000-0000-000000000000"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("eeee0002-0000-0000-0000-000000000000"));
        }
    }
}
