# Vicky - Ledger Management System

Vicky is a backend application designed to manage personal or small business ledger records. It allows users to manage counterparties and track transactions with them.

## 🚀 Features

- **User Authentication:** Secure registration and login using JWT.
- **Counterparty Management:** Create and manage counterparties (e.g., vendors, clients).
- **Transaction Tracking:** Record transactions with specific amounts and dates associated with counterparties.
- **Filtering:** Query transactions by date range.
- **Domain-Driven Design (DDD) Influence:** Separation of concerns between API, Users, Ledger, and Common modules.

## 🛠️ Project Structure

- **Vicky.API:** The main entry point, containing controllers, middleware, and infrastructure implementations.
- **Vicky.Users:** Handles user registration, login, and authentication logic.
- **Vicky.Ledger:** Core domain for counterparties and transactions.
- **Vicky.Common:** Shared logic, logging, and common exceptions.
- **Migrations:** SQL scripts for setting up the PostgreSQL database.

## ⚙️ Prerequisites

- **.NET 10 SDK**
- **Docker & Docker Compose**
- **PostgreSQL** (running via Docker)

## 🚦 Getting Started

### 1. Start the Database

The project uses PostgreSQL. You can spin up the database using Docker Compose:

```bash
docker-compose up -d
```

*Note: The migrations in the `Migrations/` folder are automatically executed by the PostgreSQL container on startup via `docker-entrypoint-initdb.d`.*

### 2. Run the API

Navigate to the API project and run it:

```bash
cd Vicky.API
dotnet run
```

The API will be available at `http://localhost:5037` (or as configured in `launchSettings.json`).

## 🧪 API Endpoints

### Auth
- `POST /User/Register`: Register a new user.
- `POST /User/Login`: Authenticate and receive a JWT.
- `GET /Profile`: Get current user profile.

### Counterparty
- `POST /Counterparty`: Create a new counterparty.

### Transactions
- `POST /Transaction`: Record a new transaction.
- `GET /Transaction`: Retrieve transactions by date range (`startDate`, `endDate`).

## 🔧 Technology Stack

- **Runtime:** .NET 10
- **Database:** PostgreSQL
- **ORM:** Dapper
- **Authentication:** JWT Bearer
- **Containerization:** Docker
