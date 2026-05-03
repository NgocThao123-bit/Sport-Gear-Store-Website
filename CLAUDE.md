# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack sports gear e-commerce store. Gen Z visual style (bold typography, lime/purple palette).

- **Backend**: .NET 9 Clean Architecture (Domain → Application → Infrastructure → API)
- **Frontend**: React 19 + Vite + TailwindCSS + Zustand
- **Database**: SQL Server (SQLEXPRESS01), instance `SportGearStoreDB`
- **Auth**: JWT (HMAC-SHA256, 60-min expiry, stored in localStorage)

---

## Commands

### Backend

```powershell
# Run API (http://localhost:5000, Scalar UI at /scalar/v1)
cd backend/src/SportGearStore.API
dotnet run

# Add migration (run from Infrastructure project)
cd backend/src/SportGearStore.Infrastructure
dotnet ef migrations add <MigrationName> --startup-project ..\SportGearStore.API\SportGearStore.API.csproj

# Apply migration
dotnet ef database update --startup-project ..\SportGearStore.API\SportGearStore.API.csproj
```

> **Stop the running API before running migrations** — EF tooling rebuilds the DLLs and fails if the process is holding them.
> The `HostAbortedException` printed during migration is **normal** — EF Core intentionally aborts the host after reading the DbContext.

### Frontend

> **PowerShell blocks `npm` execution policy** — always start the frontend from `cmd`, not PowerShell:

```powershell
# In PowerShell, open a cmd window:
Start-Process cmd -ArgumentList "/k cd /d D:\Project2026\SportGearStoreDemo\frontend && npm run dev"
```

```bash
# Or directly in cmd:
cd frontend
npm run dev       # Dev server at http://localhost:5173
npm run build     # Production build → frontend/dist/
npm run lint
```

---

## Architecture

### Backend Layer Rules

Dependencies flow inward only: `API → Application → Domain`. Infrastructure depends on Application interfaces, never the reverse.

**Domain** (`SportGearStore.Domain`) — no framework dependencies. All entities extend `BaseEntity` (Guid Id, CreatedAt, UpdatedAt). Key entities: User, Product, ProductImage, ProductVariant, Category, Cart, CartItem, Order, OrderItem, Review.

**Application** (`SportGearStore.Application`) — CQRS via MediatR. Each feature lives in `Features/{Feature}/`:
```
Features/Products/
├── Commands/Create/   CreateProductCommand.cs + Handler + Validator
├── Queries/GetAll/    GetAllProductsQuery.cs + Handler
└── DTOs/              ProductDtos.cs
```
MediatR pipeline behaviors run in order: `LoggingBehavior` → `ValidationBehavior` → Handler.
AutoMapper is configured in `Common/Mappings/MappingProfile.cs` — this is where calculated fields like `MainImageUrl` and `AverageRating` are set on DTOs.

**Infrastructure** (`SportGearStore.Infrastructure`) — EF Core, JWT, repositories. Each entity has a fluent `IEntityTypeConfiguration<T>` in `Persistence/Configurations/`. `UnitOfWork.cs` lazy-initializes all repositories and exposes a single `SaveChangesAsync()`.

**API** (`SportGearStore.API`) — thin controllers that dispatch MediatR commands/queries. Global exception handling in `Middleware/ExceptionMiddleware.cs` maps custom exceptions to HTTP status codes.

### DTO Pattern — Critical

All DTOs **must use property-based records** (not positional). AutoMapper requires a parameterless constructor:

```csharp
// ✅ Correct
public record ProductDto
{
    public Guid   Id   { get; init; }
    public string Name { get; init; } = string.Empty;
}

// ❌ Breaks AutoMapper — no parameterless constructor
public record ProductDto(Guid Id, string Name);
```

Same rule applies to `CartDto`, `OrderDto`, `CategoryDto`, `AuthResponseDto`.

### Frontend Architecture

**API layer** (`src/api/`) — one file per domain. All use `axiosClient.js` which:
- Sets `baseURL = http://localhost:5000/api`
- Injects `Authorization: Bearer <token>` from localStorage on every request
- On 401, clears token and redirects to `/login`

**State** (`src/store/`) — Zustand only (no Redux, no Context API):
- `useAuthStore` — token, decoded user, login/register/logout
- `useCartStore` — cart items, fetchCart, addItem, removeItem

**Routing** (`App.jsx`) — React Router v7. Public routes: `/`, `/products`, `/products/:slug`, `/cart`, `/login`, `/register`. Admin routes: `/admin`, `/admin/products`, `/admin/orders`.

### Tailwind Custom Tokens

Always use these brand tokens instead of raw colors:

| Token | Value | Use |
|---|---|---|
| `brand-lime` | `#C8FF00` | Primary accent, CTA buttons |
| `brand-purple` | `#9B5CF6` | Hover states |
| `brand-blue` | `#38BCFF` | Equipment category |
| `brand-cream` | `#F8F8F4` | Page background |
| `brand-ink` | `#0A0A0A` | Text, dark elements |

Custom fonts: `font-display` (Bebas Neue), `font-sketch` (Caveat), `font-sans` (Space Grotesk).

### Product Images

Product card images use `product.mainImageUrl` (camelCase of `MainImageUrl` from the DTO — **not** `imageUrl`).
Images are PNG cutouts — the product card applies `style={{ mixBlendMode: 'multiply' }}` to blend white backgrounds into the cream card background.

### Seed Data GUIDs

Fixed GUIDs used in `HasData()` — do not change them across migrations:
- Categories: `aaaa0001..` → Clothing, `aaaa0002..` → Footwear, `aaaa0003..` → Equipment
- Products: `bbbb0001..` → `bbbb0009..` (3 per category)
- Images: `cccc0001..` → `cccc0009..`
- Variants: `dddd0001..` → `dddd0042..`

---

## Key Constraints

- **ExceptionMiddleware** currently exposes raw `exception.Message` in 500 responses (debug mode). Revert before production by returning a generic message instead.
- **CORS** is configured to allow only `http://localhost:5173`. Update `Program.cs` for any other frontend origin.
- **BCrypt** is used for password hashing (`BCrypt.Net.BCrypt.HashPassword`). Never store plain-text passwords.
- **No test projects exist yet** in the solution.
