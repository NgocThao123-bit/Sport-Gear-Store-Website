# SportGear Store

A full-stack sports gear e-commerce demo built with **.NET 9 Clean Architecture** and **React 19 + Vite + TailwindCSS**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | .NET 9, ASP.NET Core, MediatR (CQRS), AutoMapper, FluentValidation |
| Database | SQL Server (via Entity Framework Core 9) |
| Auth | JWT (HMAC-SHA256, stored in `localStorage`) |
| Frontend | React 19, Vite, TailwindCSS, Zustand, TanStack Table, Axios |
| API Docs | Scalar UI (`/scalar/v1`) |

---

## Project Structure

```
SportGearStoreDemo/
├── backend/
│   └── src/
│       ├── SportGearStore.Domain          # Entities, enums — no framework deps
│       ├── SportGearStore.Application     # CQRS handlers, DTOs, interfaces
│       ├── SportGearStore.Infrastructure  # EF Core, JWT, repositories
│       └── SportGearStore.API            # Controllers, middleware, Program.cs
└── frontend/
    └── src/
        ├── api/        # Axios modules (one file per domain)
        ├── components/ # Navbar, Footer, ProtectedRoute
        ├── pages/      # Route-level page components
        └── store/      # Zustand stores (auth, cart)
```

---

## Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/)
- SQL Server (any edition) with a named or default instance

---

## 1 — Database Setup

### 1.1 Update the connection string

Open `backend/src/SportGearStore.API/appsettings.json` and change the `DefaultConnection` to match your SQL Server instance:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=YOUR_SERVER\\YOUR_INSTANCE;Database=SportGearStoreDB;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
}
```

**Common examples:**

| Setup | Connection string |
|---|---|
| Local default instance | `Server=.;Database=SportGearStoreDB;Trusted_Connection=True;TrustServerCertificate=True` |
| Named instance (e.g. SQLEXPRESS) | `Server=.\SQLEXPRESS;Database=SportGearStoreDB;Trusted_Connection=True;TrustServerCertificate=True` |
| SQL Server Auth | `Server=.;Database=SportGearStoreDB;User Id=sa;Password=yourPass;TrustServerCertificate=True` |

> The database (`SportGearStoreDB`) will be **created automatically** by EF Core migrations — you do not need to create it manually.

### 1.2 Run migrations

```powershell
# From the Infrastructure project folder
cd backend/src/SportGearStore.Infrastructure

dotnet ef database update --startup-project ..\SportGearStore.API\SportGearStore.API.csproj
```

This creates all tables **and seeds** the following data automatically:
- 3 categories (Clothing, Footwear, Equipment)
- 9 products with images and size/color variants
- 1 Admin user and 1 Customer user (see credentials below)

---

## 2 — Run the Backend

```powershell
cd backend/src/SportGearStore.API
dotnet run
```

The API starts at **`http://localhost:5000`**.

- **Scalar API Docs:** `http://localhost:5000/scalar/v1`

> Stop the API before running migrations — EF tooling cannot overwrite DLLs that are in use.

---

## 3 — Run the Frontend

> **PowerShell blocks npm** — start the frontend from **cmd**, not PowerShell:

```powershell
# Open a cmd window from PowerShell:
Start-Process cmd -ArgumentList "/k cd /d D:\path\to\SportGearStoreDemo\frontend && npm install && npm run dev"
```

Or directly in **cmd**:

```cmd
cd frontend
npm install
npm run dev
```

The app starts at **`http://localhost:5173`** (or `5174` if port is busy).

> If the frontend starts on port **5174**, open `backend/src/SportGearStore.API/Program.cs` and add `http://localhost:5174` to the CORS `WithOrigins(...)` list, then restart the API.

---

## 4 — Configuration Reference

| File | What to change |
|---|---|
| `backend/.../appsettings.json` | `ConnectionStrings.DefaultConnection` — your SQL Server instance |
| `backend/.../appsettings.json` | `JwtSettings.SecretKey` — change before deploying to production |
| `frontend/src/api/axiosClient.js` | `baseURL` — if your API runs on a port other than `5000` |

---

## 5 — Test Accounts

### Admin
| Field | Value |
|---|---|
| Email | `admin@sportgear.com` |
| Password | `Admin@123` |
| Access | Full admin panel (`/admin`, `/admin/products`, `/admin/orders`) |

### Customer
| Field | Value |
|---|---|
| Email | `customer@example.com` |
| Password | `Customer@123` |
| Access | Shop, cart, checkout, order history, profile |

You can also **register a new account** at `/register` — new accounts are customers by default.

---

## 6 — Feature Flows

### Customer Flow

```
Register / Login
    └── Browse products (/products)
            ├── Filter by category, search by name/brand, sort by price
            └── Click product → Product Detail (/products/:slug)
                    ├── Select size / color variant
                    ├── Adjust quantity
                    └── Add to Cart
                            └── Cart (/cart)
                                    ├── Review items, remove items
                                    └── Checkout →
                                            ├── Enter shipping address
                                            ├── Choose payment method (Credit Card / COD / Bank Transfer)
                                            └── Place Order → Success screen
                                                    └── View My Orders (/orders)
                                                            └── Click any order → detail drawer
                                                                    (items, price, shipping, status)
```

### Admin Flow

```
Login as admin
    └── /admin — Dashboard
            ├── Total orders, revenue, products, customers
            └── Top selling products

        /admin/products — Manage Products
            ├── TanStack Table with search + sort + pagination (10/page)
            ├── Create product (name, brand, price, category, image URL, variants)
            ├── Edit product (name, brand, price, sale price, active toggle)
            └── Delete product

        /admin/orders — Manage Orders
            ├── TanStack Table with status filter tabs + pagination (10/page)
            ├── Click any row → detail drawer (customer info, items, shipping, price)
            └── Change order status (Pending → Processing → Shipped → Delivered / Cancelled)
```

### Profile Flow

```
Click username in navbar → /profile
    ├── View: email (read-only), name, phone, address
    └── Edit Profile button → inline edit mode
            └── Save Changes → updates immediately
```

---

## 7 — API Endpoints Summary

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new account |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/products` | Public | List products (filter, search, paginate) |
| GET | `/api/products/:slug` | Public | Product detail with variants & reviews |
| GET | `/api/categories` | Public | All categories |
| GET | `/api/cart` | User | Get current user's cart |
| POST | `/api/cart/items` | User | Add item to cart |
| DELETE | `/api/cart/items/:id` | User | Remove item from cart |
| POST | `/api/orders` | User | Checkout (create order from cart) |
| GET | `/api/orders` | User | My order history (paginated) |
| GET | `/api/orders/:id` | User/Admin | Order detail |
| GET | `/api/profile` | User | Get my profile |
| PUT | `/api/profile` | User | Update name, phone, address |
| GET | `/api/orders/admin/all` | Admin | All orders (paginated, status filter) |
| PUT | `/api/orders/:id/status` | Admin | Update order status |
| GET | `/api/products` (admin query) | Admin | All products including inactive |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Edit product |
| DELETE | `/api/products/:id` | Admin | Delete product |

Full interactive docs: **`http://localhost:5000/scalar/v1`**

---

## 8 — Notes

- **Passwords** are hashed with BCrypt — never stored in plain text.
- **JWT** expires after 60 minutes. The frontend clears it on expiry (401 response).
- **CORS** is configured for `localhost:5173` and `localhost:5174` only. Update `Program.cs` for any other origin.
- **ExceptionMiddleware** currently returns raw exception messages in 500 responses (debug mode). Replace with a generic message before deploying to production.
- **Images** use external URLs. No file upload is implemented — add image URLs manually when creating products.
