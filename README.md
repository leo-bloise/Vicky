# Vicky - Ledger Management System

Vicky is a full-stack application designed to manage personal or small business ledger records. It allows users to manage counterparties and track transactions with them. The application consists of a .NET backend API and a React frontend.

## 🚀 Features

- **User Authentication:** Secure registration and login using JWT.
- **Counterparty Management:** Create and manage counterparties (e.g., vendors, clients).
- **Transaction Tracking:** Record transactions with specific amounts and dates associated with counterparties.
- **Filtering:** Query transactions by date range.
- **Web Interface:** User-friendly React-based frontend for interacting with the API.
- **Domain-Driven Design (DDD) Influence:** Separation of concerns between API, Users, Ledger, and Common modules.

## 🛠️ Project Structure

- **Vicky.API:** The main entry point, containing controllers, middleware, and infrastructure implementations.
- **Vicky.Users:** Handles user registration, login, and authentication logic.
- **Vicky.Ledger:** Core domain for counterparties and transactions.
- **Vicky.Common:** Shared logic, logging, and common exceptions.
- **Vicky.FrontEnd:** React-based frontend application built with Vite and TypeScript.
- **Migrations:** SQL scripts for setting up the PostgreSQL database.

## ⚙️ Prerequisites

- **.NET 10 SDK**
- **Node.js** (version 18 or higher) and npm (or bun)
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

The API will be available at `http://localhost:5036` (or as configured in `launchSettings.json`).

### 3. Run the Frontend

In a new terminal, navigate to the frontend project and start the development server:

```bash
cd Vicky.FrontEnd
npm run dev
```

The frontend will be available at `http://localhost:5173` (default Vite port).

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

- **Backend Runtime:** .NET 10
- **Frontend Framework:** React with TypeScript
- **Build Tool:** Vite
- **UI Library:** Radix UI
- **Database:** PostgreSQL
- **ORM:** Dapper
- **Authentication:** JWT Bearer
- **Containerization:** Docker
