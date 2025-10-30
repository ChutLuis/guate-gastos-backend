# GuateGastos API Documentation

## Overview

GuateGastos is a comprehensive personal finance management backend built with NestJS, Prisma, and PostgreSQL. It provides a modern, secure REST API for managing personal finances with JWT-based authentication.

## 🚀 Server Information

- **Base URL**: `http://localhost:3000/api/v1`
- **Environment**: Development
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)

## 📋 Table of Contents

1. [Authentication](#authentication)
2. [API Endpoints](#api-endpoints)
3. [Data Models](#data-models)
4. [Error Handling](#error-handling)
5. [Examples](#examples)

---

## 🔐 Authentication

All endpoints except `/auth/register` and `/auth/login` require JWT authentication.

### Register

Create a new user account.

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your_secure_password",
  "timezone": "America/Guatemala" (optional)
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "timezone": "America/Guatemala"
  }
}
```

### Login

Authenticate and receive tokens.

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your_secure_password"
}
```

### Refresh Token

Get a new access token using a refresh token.

```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your_refresh_token"
}
```

### Get Profile

Get current user profile.

```http
GET /api/v1/auth/me
Authorization: Bearer {accessToken}
```

---

## 📊 API Endpoints

### Standard CRUD Operations

All resource endpoints follow REST conventions:

- **GET** `/api/v1/{resource}` - List all records
- **GET** `/api/v1/{resource}/:id` - Get single record
- **POST** `/api/v1/{resource}` - Create new record
- **PATCH** `/api/v1/{resource}/:id` - Update record
- **DELETE** `/api/v1/{resource}/:id` - Delete record (soft delete)

### Available Resources

1. **Salaries** - `/api/v1/salaries`
2. **Expenses** - `/api/v1/expenses`
3. **Credit Cards** - `/api/v1/credit-cards`
4. **Transactions** - `/api/v1/transactions`
5. **Installments** - `/api/v1/installments`
6. **Installment Loans** - `/api/v1/installment-loans` ⭐ NEW
7. **Loans** - `/api/v1/loans`
8. **Loan Payments** - `/api/v1/loan-payments`
9. **Remittances** - `/api/v1/remittances`
10. **Cash Flow Events** - `/api/v1/cash-flow-events`
11. **Budgets** - `/api/v1/budgets`
12. **Payment Reminders** - `/api/v1/payment-reminders`
13. **Monthly Snapshots** - `/api/v1/monthly-snapshots`

---

## 💰 Salaries

Manage income sources.

### Create Salary

```http
POST /api/v1/salaries
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "Main Salary",
  "amount": 5000.00,
  "type": "monthly" | "biweekly",
  "firstPayment": 2500.00, // Optional, for biweekly
  "secondPayment": 2500.00 // Optional, for biweekly
}
```

---

## 💳 Expenses

Manage recurring expenses.

### Create Expense

```http
POST /api/v1/expenses
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "Rent",
  "amount": 1500.00,
  "category": "Housing",
  "dueDay": 5,
  "paidThisMonth": false
}
```

---

## 🏦 Credit Cards

Manage credit cards.

### Create Credit Card

```http
POST /api/v1/credit-cards
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "Visa Gold",
  "bank": "Bank Name",
  "limit": 10000.00,
  "cutoffDay": 20,
  "paymentDay": 25,
  "interestRate": 2.5,
  "currentBalance": 0
}
```

---

## 📝 Transactions

Manage financial transactions.

### Create Transaction

```http
POST /api/v1/transactions
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "type": "income" | "expense" | "card_payment" | "installment_payment",
  "description": "Grocery shopping",
  "amount": 150.00,
  "date": "2025-10-27",
  "category": "Food",
  "paymentMethod": "cash" | "card",
  "cardId": "uuid", // Optional
  "relatedExpenseId": "uuid", // Optional
  "notes": "Weekly groceries"
}
```

---

## 📅 Installments

Manage credit card installments.

### Create Installment

```http
POST /api/v1/installments
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "cardId": "credit-card-uuid",
  "description": "New laptop",
  "totalAmount": 1200.00,
  "monthlyPayment": 100.00,
  "totalInstallments": 12,
  "paidInstallments": 0,
  "startDate": "2025-10-27"
}
```

---

## 🏦 Installment Loans

Manage bank loans, car loans, mortgages with monthly payment schedules.

> **Note:** This is different from the `/loans` endpoint. Installment Loans are for institutional loans with payment schedules, while Loans are for simple borrowed/lent money tracking.

### Create Installment Loan

```http
POST /api/v1/installment-loans
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "description": "Car Loan",
  "totalAmount": 50000.00,
  "monthlyPayment": 2083.33,
  "totalMonths": 24,
  "paidMonths": 0,
  "interestRate": 12.5,
  "startDate": "2024-01-15",
  "dueDay": 15,
  "currentBalance": 50000.00, // Optional
  "notes": "Bank XYZ - Auto financing" // Optional
}
```

**Key Fields:**
- `description`: Loan name (e.g., "Car Loan", "Personal Loan", "Mortgage")
- `totalAmount`: Original principal amount
- `monthlyPayment`: Fixed monthly payment
- `totalMonths`: Total loan duration in months
- `paidMonths`: Months paid so far
- `interestRate`: Annual interest rate percentage
- `startDate`: Loan start date (YYYY-MM-DD)
- `dueDay`: Day of month payment is due (1-31)

**📚 Full API Documentation:** See [INSTALLMENT_LOANS_API.md](./INSTALLMENT_LOANS_API.md) for complete details.

---

## 💸 Loans

Manage loans (borrowed or lent).

### Create Loan

```http
POST /api/v1/loans
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "type": "borrowed" | "lent",
  "person": "John Doe",
  "amount": 5000.00,
  "date": "2025-10-27",
  "dueDate": "2025-12-27",
  "paid": false,
  "interestRate": 5.0,
  "notes": "Emergency loan"
}
```

---

## 💵 Remittances

Track remittances from abroad.

### Create Remittance

```http
POST /api/v1/remittances
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "sender": "Maria Garcia",
  "frequency": "weekly" | "biweekly" | "monthly" | "irregular",
  "expectedAmount": 500.00,
  "exchangeRate": 7.85,
  "lastReceived": "2025-10-27",
  "method": "Western Union"
}
```

---

## 💰 Cash Flow Events

Track cash movements.

### Create Cash Flow Event

```http
POST /api/v1/cash-flow-events
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "type": "withdrawal" | "deposit" | "spent",
  "amount": 200.00,
  "location": "ATM Main St",
  "fee": 2.50,
  "notes": "Emergency withdrawal"
}
```

---

## 🎯 Budgets

Manage spending budgets by category.

### Create Budget

```http
POST /api/v1/budgets
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "category": "Food",
  "limitAmount": 600.00,
  "spent": 0,
  "period": "monthly" | "yearly",
  "alertThreshold": 80 // Percentage
}
```

---

## ⏰ Payment Reminders

Set up payment reminders.

### Create Payment Reminder

```http
POST /api/v1/payment-reminders
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "title": "Credit Card Payment",
  "description": "Visa payment due",
  "dueDate": "2025-11-05",
  "amount": 500.00,
  "type": "credit_card" | "bill" | "installment" | "custom",
  "relatedId": "uuid", // Optional
  "notificationEnabled": true
}
```

---

## 📊 Monthly Snapshots

Track monthly financial summaries.

### Create Monthly Snapshot

```http
POST /api/v1/monthly-snapshots
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "month": "2025-10", // YYYY-MM format
  "totalIncome": 5000.00,
  "totalExpenses": 3000.00,
  "totalInstallments": 500.00,
  "availableFunds": 1500.00,
  "transactionCount": 45
}
```

### Get Snapshot by Month

```http
GET /api/v1/monthly-snapshots/by-month?month=2025-10
Authorization: Bearer {accessToken}
```

---

## ❌ Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "statusCode": 400,
  "timestamp": "2025-10-27T05:00:00.000Z",
  "path": "/api/v1/salaries",
  "method": "POST",
  "message": "Validation failed",
  "errors": [
    {
      "field": "amount",
      "message": "amount must be a positive number"
    }
  ]
}
```

### Common Status Codes

- `200 OK` - Successful GET request
- `201 Created` - Successful POST request
- `204 No Content` - Successful DELETE request
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## 📖 Examples

### Complete Registration and Transaction Flow

#### 1. Register

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

#### 2. Create a Salary

```bash
curl -X POST http://localhost:3000/api/v1/salaries \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Main Job",
    "amount": 5000,
    "type": "monthly"
  }'
```

#### 3. Create an Expense

```bash
curl -X POST http://localhost:3000/api/v1/expenses \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rent",
    "amount": 1500,
    "category": "Housing",
    "dueDay": 1
  }'
```

#### 4. Create a Transaction

```bash
curl -X POST http://localhost:3000/api/v1/transactions \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "expense",
    "description": "Groceries",
    "amount": 150,
    "date": "2025-10-27",
    "category": "Food",
    "paymentMethod": "cash"
  }'
```

#### 5. Get All Transactions

```bash
curl -X GET http://localhost:3000/api/v1/transactions \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🔒 Security Features

### Data Isolation

- All queries automatically filter by `userId`
- Users can only access their own data
- No cross-user data leakage

### Soft Deletes

- Records are marked as deleted, not permanently removed
- `deletedAt` timestamp tracks deletion
- Allows data recovery if needed

### Sync Versioning

- `syncVersion` tracks record changes
- Supports future synchronization features
- Conflict detection ready

### Password Security

- Passwords hashed with bcrypt
- Salt rounds: 10
- Never stored in plain text

### JWT Configuration

- Access tokens expire in 7 days
- Refresh tokens expire in 30 days
- Tokens include user ID and email

---

## 🏗️ Architecture

### Technology Stack

- **Framework**: NestJS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (passport-jwt)
- **Validation**: class-validator, class-transformer
- **Language**: TypeScript

### Design Principles

- **SOLID principles** followed throughout
- **Repository pattern** with Prisma
- **Service layer** for business logic
- **DTO validation** on all inputs
- **Global exception handling**
- **Modular architecture** for scalability

---

## 🛠️ Development

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Yarn or npm

### Environment Variables

```env
# Server
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL="postgres://postgres:password@localhost:5432/guategastos"

# JWT
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Frontend
FRONTEND_URL=http://localhost:8081
```

### Running the Server

```bash
# Install dependencies
yarn install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Start development server
yarn start:dev
```

---

## 📝 Additional Notes

### Timestamps

All records include:
- `createdAt` - When the record was created
- `updatedAt` - When the record was last updated
- `deletedAt` - When the record was soft-deleted (if applicable)

### UUIDs

All IDs are UUIDs for better security and distribution.

### Decimal Fields

All monetary amounts use `Decimal` type for precision:
- 12 digits total
- 2 decimal places
- Prevents floating-point errors

---

## 🎯 Next Steps

1. **Test all endpoints** with your preferred API client (Postman, Insomnia)
2. **Integrate with mobile app** using the documented endpoints
3. **Monitor logs** for any issues
4. **Scale** as needed

---

**Made with ❤️ for GuateGastos**

*Last Updated: October 29, 2025*
