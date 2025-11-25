# 🚀 Quick Start Guide - GuateGastos Backend

## Server Is Already Running! ✅

Your backend is **live** at:
- **Base URL**: http://localhost:3000
- **API URL**: http://localhost:3000/api/v1
- **Health Check**: http://localhost:3000/api/v1/health

---

## 🎯 Test It Now

### 1. Check if it's running

```bash
curl http://localhost:3000/api/v1/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-10-27...",
  "uptime": 123.45,
  "environment": "development"
}
```

### 2. View available endpoints

```bash
curl http://localhost:3000/api/v1
```

---

## 🔐 Quick Authentication Test

### Register a new user

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456!"
  }'
```

You'll get back:
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "...",
    "email": "test@example.com",
    "timezone": "America/Guatemala"
  }
}
```

**Save the `accessToken`** - you'll need it for all other requests!

---

## 💰 Create Your First Salary

```bash
curl -X POST http://localhost:3000/api/v1/salaries \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Main Job",
    "amount": 5000,
    "type": "monthly"
  }'
```

---

## 💳 Create an Expense

```bash
curl -X POST http://localhost:3000/api/v1/expenses \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rent",
    "amount": 1500,
    "category": "Housing",
    "dueDay": 1
  }'
```

---

## 📝 Create a Transaction

```bash
curl -X POST http://localhost:3000/api/v1/transactions \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
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

---

## 📊 Get All Your Transactions

```bash
curl -X GET http://localhost:3000/api/v1/transactions \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

---

## 🛠️ Development Commands

### Start the server (if not running)
```bash
yarn start:dev
```

### Stop the server
Press `Ctrl+C` in the terminal running the server

### Reset database
```bash
npx prisma migrate reset
```

### View database
```bash
npx prisma studio
```
Then open http://localhost:5555

---

## 📱 Connect Your Mobile App

Update your mobile app API configuration:

```typescript
// config.ts
export const API_URL = 'http://localhost:3000/api/v1';
// or for testing on device:
// export const API_URL = 'http://YOUR_COMPUTER_IP:3000/api/v1';
```

### Example: Register from Mobile

```typescript
const register = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  // Save tokens
  await SecureStore.setItemAsync('accessToken', data.accessToken);
  await SecureStore.setItemAsync('refreshToken', data.refreshToken);

  return data.user;
};
```

### Example: Fetch Salaries

```typescript
const getSalaries = async () => {
  const token = await SecureStore.getItemAsync('accessToken');

  const response = await fetch(`${API_URL}/salaries`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return await response.json();
};
```

---

## 🔍 Debugging Tips

### Check server logs
The terminal running `yarn start:dev` shows all requests and errors.

### Common Issues

**401 Unauthorized?**
- Check your access token is valid
- Make sure you're including `Authorization: Bearer TOKEN` header

**404 Not Found?**
- Verify you're using `/api/v1/` prefix
- Check endpoint spelling

**400 Bad Request?**
- Check request body matches DTO requirements
- Verify all required fields are included

**500 Server Error?**
- Check server logs in terminal
- Verify database is running
- Check `.env` configuration

---

## 📚 Full Documentation

- **API_DOCUMENTATION.md** - Complete API reference
- **IMPLEMENTATION_SUMMARY.md** - What was built and how

---

## ✨ You're All Set!

Your backend is running with:
- ✅ 60+ REST endpoints
- ✅ JWT authentication
- ✅ 12 complete modules
- ✅ PostgreSQL database
- ✅ Full validation
- ✅ Error handling
- ✅ CORS enabled

**Now connect your mobile app and start building! 🚀**
