using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Tuchka.Migrations
{
    public partial class RemovePhonePrefix : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_PhonePrefixes_PhonePrefixId",
                table: "Users");

            migrationBuilder.DropTable(
                name: "PhonePrefixes");

            migrationBuilder.DropIndex(
                name: "IX_Users_PhonePrefixId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "PhonePrefixId",
                table: "Users");

            migrationBuilder.AlterColumn<string>(
                name: "PhoneNumber",
                table: "Users",
                type: "character varying(15)",
                maxLength: 15,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(10)",
                oldMaxLength: 10,
                oldNullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "PhoneNumber",
                table: "Users",
                type: "character varying(10)",
                maxLength: 10,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(15)",
                oldMaxLength: 15,
                oldNullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "PhonePrefixId",
                table: "Users",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "PhonePrefixes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Country = table.Column<string>(type: "text", nullable: true),
                    CountryShort = table.Column<string>(type: "text", nullable: true),
                    Prefix = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhonePrefixes", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_PhonePrefixId",
                table: "Users",
                column: "PhonePrefixId");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_PhonePrefixes_PhonePrefixId",
                table: "Users",
                column: "PhonePrefixId",
                principalTable: "PhonePrefixes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
