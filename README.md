# Vicky

A lightweight full-stack ledger management system.

## Stack
- **Backend**: .NET 10, Dapper, PostgreSQL
- **Frontend**: React 19, Vite, Tailwind CSS 4, Radix UI

## Architecture
- **Modular Monolith**: Separated by functional domains (Users, Ledger).
- **CQRS**: Decoupled read and write operations using custom Dispatchers.
- **Repository Pattern**: Abstracted data access for testability and flexibility.
- **DDD-Lite**: Logic centered around domain models and specialized handlers.

## Structure
- `Vicky.API`: Entry point and controllers.
- `Vicky.Users`: Authentication and user management.
- `Vicky.Ledger`: Transactions and counterparties logic.
- `Vicky.Common`: Shared infrastructure and logging.
- `Vicky.FrontEnd`: TypeScript React application.
- `Migrations`: SQL scripts for PostgreSQL.
