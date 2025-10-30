# 🔧 Backend Task: Installment Loans Endpoint

**Priority:** High
**Estimate:** 2-3 hours
**Status:** 🔴 TODO - Blocking feature sync
**Dependencies:** None

---

## 📋 **Overview**

The mobile app has an "Installment Loans" feature (préstamos) for tracking bank loans with monthly payments, but the backend `/loans` endpoint expects a different schema (simple borrowed/lent money).

**Need:** New endpoint `/installment-loans` to support the frontend schema.

---

## 🐛 **The Problem**

### **Current Situation:**
- Frontend sends loan with: `description`, `totalAmount`, `monthlyPayment`, `totalMonths`, `paidMonths`, etc.
- Backend expects: `type`, `person`, `amount`, `date`, `paid`
- **Result:** Validation error, sync fails

### **Error Message:**
```
property description should not exist
property totalAmount should not exist
type must be one of the following values: borrowed, lent
person should not be empty
```

---

## 🎯 **Task: Create New Endpoint**

### **Endpoint:** `/api/v1/installment-loans`

### **Purpose:**
Track institutional loans (banks, car loans, mortgages) with:
- Monthly payment schedules
- Payment progress tracking
- Interest rate calculation
- Remaining balance

---

## 📊 **Required Schema**

### **Database Schema (Prisma)**

```prisma
model InstallmentLoan {
  id              String   @id @default(uuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Loan Details
  description     String         // "Car Loan", "Personal Loan", "Mortgage"
  totalAmount     Decimal        // Original principal amount borrowed
  monthlyPayment  Decimal        // Fixed monthly payment amount
  totalMonths     Int            // Total loan duration in months
  paidMonths      Int            // Months paid so far
  interestRate    Decimal        // Annual interest rate (e.g., 12.5 for 12.5%)

  // Schedule
  startDate       DateTime       // When loan started
  dueDay          Int            // Day of month payment is due (1-31)

  // Optional
  currentBalance  Decimal?       // Current balance (from banking app, optional)
  notes           String?        // Additional notes

  // Metadata
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@map("installment_loans")
}
```

---

## 🔌 **API Endpoints to Implement**

### **1. Create Installment Loan**
```http
POST /api/v1/installment-loans
Authorization: Bearer {token}
Content-Type: application/json

{
  "description": "Car Loan",
  "totalAmount": 50000.00,
  "monthlyPayment": 2000.00,
  "totalMonths": 24,
  "paidMonths": 0,
  "interestRate": 12.5,
  "startDate": "2024-01-15",
  "dueDay": 15,
  "currentBalance": 50000.00,  // Optional
  "notes": "Bank XYZ"           // Optional
}
```

**Response:**
```json
{
  "id": "uuid-123",
  "description": "Car Loan",
  "totalAmount": 50000.00,
  "monthlyPayment": 2000.00,
  "totalMonths": 24,
  "paidMonths": 0,
  "interestRate": 12.5,
  "startDate": "2024-01-15T00:00:00.000Z",
  "dueDay": 15,
  "currentBalance": 50000.00,
  "notes": "Bank XYZ",
  "createdAt": "2024-12-10T10:30:00.000Z",
  "updatedAt": "2024-12-10T10:30:00.000Z"
}
```

---

### **2. Get All Installment Loans**
```http
GET /api/v1/installment-loans
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": "uuid-123",
    "description": "Car Loan",
    "totalAmount": 50000.00,
    "monthlyPayment": 2000.00,
    "totalMonths": 24,
    "paidMonths": 5,
    "interestRate": 12.5,
    "startDate": "2024-01-15T00:00:00.000Z",
    "dueDay": 15,
    "currentBalance": 38000.00,
    "notes": "Bank XYZ",
    "createdAt": "2024-12-10T10:30:00.000Z",
    "updatedAt": "2024-12-10T10:30:00.000Z"
  }
]
```

---

### **3. Get Single Installment Loan**
```http
GET /api/v1/installment-loans/:id
Authorization: Bearer {token}
```

---

### **4. Update Installment Loan**
```http
PATCH /api/v1/installment-loans/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "paidMonths": 6,
  "currentBalance": 36000.00
}
```

**Response:** Updated loan object

---

### **5. Delete Installment Loan**
```http
DELETE /api/v1/installment-loans/:id
Authorization: Bearer {token}
```

**Response:**
```json
{
  "message": "Installment loan deleted successfully"
}
```

---

## 🛠️ **Backend Implementation Guide**

### **Step 1: Add Prisma Model**
**File:** `prisma/schema.prisma`

```prisma
model InstallmentLoan {
  id              String   @id @default(uuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  description     String
  totalAmount     Decimal  @db.Decimal(10, 2)
  monthlyPayment  Decimal  @db.Decimal(10, 2)
  totalMonths     Int
  paidMonths      Int      @default(0)
  interestRate    Decimal  @db.Decimal(5, 2)
  startDate       DateTime
  dueDay          Int
  currentBalance  Decimal? @db.Decimal(10, 2)
  notes           String?

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@map("installment_loans")
}
```

### **Step 2: Run Migration**
```bash
cd backend
npx prisma migrate dev --name add_installment_loans
```

---

### **Step 3: Create DTO**
**File:** `src/installment-loans/dto/create-installment-loan.dto.ts`

```typescript
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInstallmentLoanDto {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  totalAmount: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  monthlyPayment: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  totalMonths: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  paidMonths: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  interestRate: number;

  @IsNotEmpty()
  @Type(() => Date)
  startDate: Date;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(31)
  dueDay: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  currentBalance?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
```

---

### **Step 4: Create Controller**
**File:** `src/installment-loans/installment-loans.controller.ts`

```typescript
import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { InstallmentLoansService } from './installment-loans.service';
import { CreateInstallmentLoanDto } from './dto/create-installment-loan.dto';
import { UpdateInstallmentLoanDto } from './dto/update-installment-loan.dto';

@Controller('installment-loans')
@UseGuards(JwtAuthGuard)
export class InstallmentLoansController {
  constructor(private readonly installmentLoansService: InstallmentLoansService) {}

  @Post()
  create(@GetUser('id') userId: string, @Body() dto: CreateInstallmentLoanDto) {
    return this.installmentLoansService.create(userId, dto);
  }

  @Get()
  findAll(@GetUser('id') userId: string) {
    return this.installmentLoansService.findAll(userId);
  }

  @Get(':id')
  findOne(@GetUser('id') userId: string, @Param('id') id: string) {
    return this.installmentLoansService.findOne(userId, id);
  }

  @Patch(':id')
  update(
    @GetUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateInstallmentLoanDto,
  ) {
    return this.installmentLoansService.update(userId, id, dto);
  }

  @Delete(':id')
  remove(@GetUser('id') userId: string, @Param('id') id: string) {
    return this.installmentLoansService.remove(userId, id);
  }
}
```

---

### **Step 5: Create Service**
**File:** `src/installment-loans/installment-loans.service.ts`

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInstallmentLoanDto } from './dto/create-installment-loan.dto';
import { UpdateInstallmentLoanDto } from './dto/update-installment-loan.dto';

@Injectable()
export class InstallmentLoansService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateInstallmentLoanDto) {
    return this.prisma.installmentLoan.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.installmentLoan.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const loan = await this.prisma.installmentLoan.findFirst({
      where: { id, userId },
    });

    if (!loan) {
      throw new NotFoundException('Installment loan not found');
    }

    return loan;
  }

  async update(userId: string, id: string, dto: UpdateInstallmentLoanDto) {
    await this.findOne(userId, id); // Verify ownership

    return this.prisma.installmentLoan.update({
      where: { id },
      data: dto,
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id); // Verify ownership

    await this.prisma.installmentLoan.delete({
      where: { id },
    });

    return { message: 'Installment loan deleted successfully' };
  }
}
```

---

### **Step 6: Register Module**
**File:** `src/app.module.ts`

```typescript
import { InstallmentLoansModule } from './installment-loans/installment-loans.module';

@Module({
  imports: [
    // ... other modules
    InstallmentLoansModule,
  ],
})
export class AppModule {}
```

---

## 🧪 **Testing Checklist**

### **Backend Tests:**
- [ ] POST /installment-loans - Creates loan
- [ ] GET /installment-loans - Returns user's loans
- [ ] GET /installment-loans/:id - Returns specific loan
- [ ] PATCH /installment-loans/:id - Updates loan (mark month paid)
- [ ] DELETE /installment-loans/:id - Deletes loan
- [ ] Authorization - Only returns user's own loans
- [ ] Validation - Rejects invalid data

### **Integration Tests:**
- [ ] Mobile app creates loan → Appears in database
- [ ] Mobile app marks month paid → Updates in database
- [ ] Mobile app deletes loan → Removed from database
- [ ] Multi-device sync works

---

## 📝 **Frontend Changes (After Backend Ready)**

Once backend endpoint is ready, enable sync in frontend:

**File:** `services/DataServiceEnhanced.ts`

```typescript
// ===== INSTALLMENT LOANS =====

async addLoan(loan: Omit<Loan, 'id'>): Promise<Loan> {
  const newLoan = await this.baseService.addLoan(loan);
  await this.syncChange('installmentLoans', 'create', newLoan.id, newLoan);  // ✅ RE-ENABLE
  return newLoan;
}

async updateLoan(id: string, updates: Partial<Loan>): Promise<void> {
  await this.baseService.updateLoan(id, updates);
  const loans = await this.baseService.getLoans();
  const loan = loans.find((l) => l.id === id);
  if (loan) {
    await this.syncChange('installmentLoans', 'update', id, loan);  // ✅ RE-ENABLE
  }
}

async deleteLoan(id: string): Promise<void> {
  await this.baseService.deleteLoan(id);
  await this.syncChange('installmentLoans', 'delete', id);  // ✅ RE-ENABLE
}
```

**Also update:**
- `services/sync/types.ts` - Add `'installmentLoans'` to `SyncableResource` type
- `services/sync/SyncService.ts` - Add endpoint mapping: `installmentLoans: '/installment-loans'`
- `services/api/config.ts` - Add `INSTALLMENT_LOANS: '/installment-loans'`

---

## 🎯 **Acceptance Criteria**

✅ **Backend:**
- [ ] New Prisma model created
- [ ] Migration run successfully
- [ ] CRUD endpoints implemented (5 endpoints)
- [ ] DTOs with validation created
- [ ] Service logic implemented
- [ ] All endpoints protected with JWT auth
- [ ] User can only access their own loans
- [ ] Tests passing

✅ **Frontend:**
- [ ] Sync enabled in DataServiceEnhanced
- [ ] Config updated with new endpoint
- [ ] Tested: Loans sync to server
- [ ] Tested: Multi-device sync works
- [ ] No validation errors

---

## 📚 **Reference**

### **Frontend Loan Interface:**
```typescript
export interface Loan {
  id: string;
  description: string;        // "Car Loan", "Personal Loan"
  totalAmount: string;         // "50000.00"
  monthlyPayment: string;      // "2000.00"
  totalMonths: number;         // 24
  paidMonths: number;          // 5
  interestRate: string;        // "12.5"
  startDate: string;           // "2024-01-15T00:00:00.000Z"
  dueDay: number;              // 15
  currentBalance?: string;     // "38000.00" (optional)
  notes?: string;              // Optional notes
}
```

### **Example Loan Data:**
```json
{
  "description": "Préstamo Personal BAC",
  "totalAmount": "50000.00",
  "monthlyPayment": "2083.33",
  "totalMonths": 24,
  "paidMonths": 5,
  "interestRate": "12.5",
  "startDate": "2024-01-15T00:00:00.000Z",
  "dueDay": 15,
  "currentBalance": "41666.65"
}
```

---

## ⏱️ **Estimated Time**

| Task | Time |
|------|------|
| Prisma schema | 15 min |
| Migration | 5 min |
| DTOs | 20 min |
| Controller | 20 min |
| Service | 30 min |
| Module setup | 10 min |
| Testing | 30 min |
| Frontend updates | 20 min |
| **Total** | **2.5 hours** |

---

## 🚨 **Important Notes**

### **Don't Confuse With Existing `/loans` Endpoint**

**Existing `/loans`** = Simple borrowed/lent money
- `type`: borrowed or lent
- `person`: Who you borrowed from
- `amount`: Simple amount
- `paid`: Boolean

**New `/installment-loans`** = Complex bank loans
- `description`: Loan name
- `monthlyPayment`: Payment schedule
- `totalMonths` & `paidMonths`: Progress tracking
- `interestRate`: Interest calculation

**These are TWO DIFFERENT features - both should exist!**

---

## 🔗 **Related Issues**

- Frontend issue documented in: `docs/LOAN_SYNC_ISSUE_RESOLUTION.md`
- Current sync status: `docs/SYNC_MIGRATION_COMPLETE.md`
- Sync disabled temporarily in: `services/DataServiceEnhanced.ts` (lines 204-227)

---

## ✅ **Checklist**

### **Before Starting:**
- [ ] Read this entire document
- [ ] Review frontend Loan interface in `types.ts`
- [ ] Check existing `/loans` endpoint (don't modify it!)
- [ ] Understand these are different concepts

### **During Development:**
- [ ] Create Prisma model
- [ ] Run migration
- [ ] Generate Prisma client
- [ ] Create DTOs
- [ ] Implement controller
- [ ] Implement service
- [ ] Add to app.module
- [ ] Test with Postman/Insomnia
- [ ] Update API documentation

### **After Completion:**
- [ ] Notify frontend team (or yourself!)
- [ ] Update frontend sync config
- [ ] Re-enable sync in DataServiceEnhanced
- [ ] Test end-to-end
- [ ] Update documentation

---

## 🎊 **Summary**

### **What's Needed:**
New `/installment-loans` endpoint in backend to support frontend installment loan feature

### **Why:**
Frontend and backend have different "Loan" concepts - need separate endpoints

### **Impact:**
Once implemented, installment loans will sync across devices like all other data

### **Time:**
~2.5 hours

---

**This is a HIGH PRIORITY task for complete sync functionality!** 🚀

---

**Last Updated:** December 2024
**Status:** 🔴 TODO - Backend Implementation Needed
**Blocking:** Installment Loans multi-device sync
