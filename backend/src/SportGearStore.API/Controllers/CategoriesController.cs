// ============================================================
// FILE: Controllers/CategoriesController.cs
// ENDPOINTS:
//   GET  /api/categories      → public
//   POST /api/categories      → Admin only
// ============================================================

using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportGearStore.Application.Features.Categories.Commands.CreateCategory;
using SportGearStore.Application.Features.Categories.Queries.GetCategories;

namespace SportGearStore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ISender _sender;

    public CategoriesController(ISender sender)
    {
        _sender = sender;
    }

    // GET /api/categories
    [HttpGet]
    public async Task<IActionResult> GetCategories(CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetCategoriesQuery(), cancellationToken);
        return Ok(result);
    }

    // POST /api/categories — Admin only
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateCategory(
        [FromBody] CreateCategoryCommand command,
        CancellationToken cancellationToken)
    {
        var categoryId = await _sender.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetCategories), new { id = categoryId }, new { id = categoryId });
    }
}
