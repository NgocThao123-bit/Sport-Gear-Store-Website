// ============================================================
// FILE: Controllers/ProductsController.cs
// PURPOSE: Product endpoints for shop (public) and admin (protected).
// MỤC ĐÍCH: Endpoints sản phẩm cho cửa hàng (public) và admin (được bảo vệ).
//
// ENDPOINTS:
//   GET    /api/products           → public — paginated + filtered list
//   GET    /api/products/{id}      → public — product detail
//   POST   /api/products           → Admin only
//   PUT    /api/products/{id}      → Admin only
//   DELETE /api/products/{id}      → Admin only
// ============================================================

using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportGearStore.Application.Features.Products.Commands.CreateProduct;
using SportGearStore.Application.Features.Products.Commands.DeleteProduct;
using SportGearStore.Application.Features.Products.Commands.UpdateProduct;
using SportGearStore.Application.Features.Products.Queries.GetProductById;
using SportGearStore.Application.Features.Products.Queries.GetProductBySlug;
using SportGearStore.Application.Features.Products.Queries.GetProducts;

namespace SportGearStore.API.Controllers;

[ApiController]
[Route("api/[controller]")]  // → /api/products
public class ProductsController : ControllerBase
{
    private readonly ISender _sender;

    public ProductsController(ISender sender)
    {
        _sender = sender;
    }

    // GET /api/products?pageNumber=1&pageSize=12&categoryId=...&searchTerm=nike
    [HttpGet]
    public async Task<IActionResult> GetProducts(
        [FromQuery] GetProductsQuery query,
        CancellationToken cancellationToken)
    {
        var result = await _sender.Send(query, cancellationToken);
        return Ok(result);
    }

    // GET /api/products/slug/{slug} — product detail by URL slug
    [HttpGet("slug/{slug}")]
    public async Task<IActionResult> GetProductBySlug(
        string slug,
        CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetProductBySlugQuery(slug), cancellationToken);
        return Ok(result);
    }

    // GET /api/products/{id}
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetProductById(
        Guid id,
        CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetProductByIdQuery(id), cancellationToken);
        return Ok(result);
    }

    // POST /api/products — Admin only
    // [Authorize(Roles = "Admin")] tells ASP.NET Core to check the JWT role claim
    // [Authorize(Roles = "Admin")] nói với ASP.NET Core kiểm tra role claim trong JWT
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateProduct(
        [FromBody] CreateProductCommand command,
        CancellationToken cancellationToken)
    {
        var productId = await _sender.Send(command, cancellationToken);

        // 201 Created with Location header pointing to the new product
        // 201 Created với Location header trỏ đến sản phẩm mới
        return CreatedAtAction(nameof(GetProductById), new { id = productId }, new { id = productId });
    }

    // PUT /api/products/{id} — Admin only
    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateProduct(
        Guid id,
        [FromBody] UpdateProductCommand command,
        CancellationToken cancellationToken)
    {
        // Ensure the route id matches the body id
        // Đảm bảo id trong route khớp với id trong body
        if (id != command.Id)
            return BadRequest("Route id does not match body id.");

        await _sender.Send(command, cancellationToken);
        return NoContent(); // 204 — success, nothing to return
    }

    // DELETE /api/products/{id} — Admin only (soft delete)
    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteProduct(
        Guid id,
        CancellationToken cancellationToken)
    {
        await _sender.Send(new DeleteProductCommand(id), cancellationToken);
        return NoContent();
    }
}
