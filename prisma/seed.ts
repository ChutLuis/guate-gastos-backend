import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data (in reverse dependency order)
  console.log('🗑️  Clearing existing data...');
  await prisma.receipt.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.recurrenceRule.deleteMany();
  await prisma.loanPayment.deleteMany();
  await prisma.loan.deleteMany();
  await prisma.installmentLoan.deleteMany();
  await prisma.installment.deleteMany();
  await prisma.creditCard.deleteMany();
  await prisma.remittance.deleteMany();
  await prisma.cashFlowEvent.deleteMany();
  await prisma.budget.deleteMany();
  await prisma.paymentReminder.deleteMany();
  await prisma.monthlySnapshot.deleteMany();
  await prisma.syncLog.deleteMany();
  await prisma.user.deleteMany();

  // Create demo user
  console.log('👤 Creating demo user...');
  const hashedPassword = await bcrypt.hash('demo123', 10);
  const user = await prisma.user.create({
    data: {
      email: 'demo@guatemalagastos.com',
      password: hashedPassword,
      settings: {
        currency: 'GTQ',
        language: 'es',
        notifications: true,
      },
      timezone: 'America/Guatemala',
    },
  });

  console.log(`✅ Created user: ${user.email}`);

  // Create RecurrenceRules
  console.log('🔄 Creating RecurrenceRules...');

  // 1. Monthly Salary (Income) - 15th of each month
  const salaryRule = await prisma.recurrenceRule.create({
    data: {
      userId: user.id,
      type: 'income',
      name: 'Salario Mensual',
      amount: 8500.0,
      category: 'Salario',
      frequency: 'monthly',
      dayOfMonth: 15,
      interval: 1,
      autoGenerate: true,
      isActive: true,
      lastGenerated: new Date('2025-01-15'),
      nextGeneration: new Date('2025-02-15'),
      notes: 'Salario del trabajo principal',
    },
  });

  console.log(`✅ Created RecurrenceRule: ${salaryRule.name}`);

  // 2. Monthly Rent (Expense) - 1st of each month
  const rentRule = await prisma.recurrenceRule.create({
    data: {
      userId: user.id,
      type: 'expense',
      name: 'Renta Apartamento',
      amount: 2500.0,
      category: 'Vivienda',
      frequency: 'monthly',
      dayOfMonth: 1,
      interval: 1,
      autoGenerate: true,
      isActive: true,
      lastGenerated: new Date('2025-01-01'),
      nextGeneration: new Date('2025-02-01'),
      notes: 'Pago mensual de renta',
    },
  });

  console.log(`✅ Created RecurrenceRule: ${rentRule.name}`);

  // 3. Bi-weekly Groceries (Expense)
  const groceryRule = await prisma.recurrenceRule.create({
    data: {
      userId: user.id,
      type: 'expense',
      name: 'Presupuesto Supermercado',
      amount: 600.0,
      category: 'Comida',
      frequency: 'biweekly',
      dayOfWeek: 1,
      interval: 2,
      autoGenerate: true,
      isActive: true,
      lastGenerated: new Date('2025-01-13'),
      nextGeneration: new Date('2025-01-27'),
      notes: 'Compras quincenales del supermercado',
    },
  });

  console.log(`✅ Created RecurrenceRule: ${groceryRule.name}`);

  // 4. Monthly Netflix Subscription
  const netflixRule = await prisma.recurrenceRule.create({
    data: {
      userId: user.id,
      type: 'expense',
      name: 'Suscripción Netflix',
      amount: 89.0,
      category: 'Entretenimiento',
      frequency: 'monthly',
      dayOfMonth: 5,
      interval: 1,
      autoGenerate: true,
      isActive: true,
      lastGenerated: new Date('2025-01-05'),
      nextGeneration: new Date('2025-02-05'),
      notes: 'Plan Premium Netflix',
    },
  });

  console.log(`✅ Created RecurrenceRule: ${netflixRule.name}`);

  // Create historical completed transactions
  console.log('📊 Creating historical completed transactions...');

  const today = new Date();
  const threeMonthsAgo = new Date(today);
  threeMonthsAgo.setMonth(today.getMonth() - 3);

  // Salary history (last 3 months)
  const salaryTransactions: any[] = [];
  for (let i = 2; i >= 0; i--) {
    const date = new Date(today);
    date.setMonth(today.getMonth() - i);
    date.setDate(15);

    salaryTransactions.push({
      userId: user.id,
      type: 'income' as const,
      description: `Salario Mensual - ${date.toLocaleDateString('es-GT', { month: 'long', year: 'numeric' })}`,
      amount: 8500.0,
      date: date,
      category: 'Salario',
      status: 'completed',
      recurrenceRuleId: salaryRule.id,
      incomeSource: 'primary_job' as const,
      isRecurring: true,
      subtype: 'salary' as const,
    });
  }

  await prisma.transaction.createMany({ data: salaryTransactions });
  console.log(`✅ Created ${salaryTransactions.length} salary transactions`);

  // Rent history (last 3 months)
  const rentTransactions: any[] = [];
  for (let i = 2; i >= 0; i--) {
    const date = new Date(today);
    date.setMonth(today.getMonth() - i);
    date.setDate(1);

    rentTransactions.push({
      userId: user.id,
      type: 'expense' as const,
      description: `Renta Apartamento - ${date.toLocaleDateString('es-GT', { month: 'long', year: 'numeric' })}`,
      amount: 2500.0,
      date: date,
      category: 'Vivienda',
      status: 'completed',
      recurrenceRuleId: rentRule.id,
      isFixedExpense: true,
      paymentMethod: 'cash' as const,
      subtype: 'fixed' as const,
    });
  }

  await prisma.transaction.createMany({ data: rentTransactions });
  console.log(`✅ Created ${rentTransactions.length} rent transactions`);

  // Grocery history (bi-weekly for 3 months)
  const groceryTransactions: any[] = [];
  const groceryDate = new Date(threeMonthsAgo);
  groceryDate.setDate(groceryDate.getDate() - (groceryDate.getDay() === 0 ? 6 : groceryDate.getDay() - 1));

  while (groceryDate < today) {
    if (groceryDate >= threeMonthsAgo) {
      groceryTransactions.push({
        userId: user.id,
        type: 'expense' as const,
        description: `Compras Supermercado - ${groceryDate.toLocaleDateString('es-GT')}`,
        amount: 600.0,
        date: new Date(groceryDate),
        category: 'Comida',
        status: 'completed',
        recurrenceRuleId: groceryRule.id,
        isFixedExpense: false,
        paymentMethod: 'cash' as const,
        subtype: 'variable' as const,
      });
    }
    groceryDate.setDate(groceryDate.getDate() + 14);
  }

  await prisma.transaction.createMany({ data: groceryTransactions });
  console.log(`✅ Created ${groceryTransactions.length} grocery transactions`);

  // Netflix subscription history (last 3 months)
  const netflixTransactions: any[] = [];
  for (let i = 2; i >= 0; i--) {
    const date = new Date(today);
    date.setMonth(today.getMonth() - i);
    date.setDate(5);

    netflixTransactions.push({
      userId: user.id,
      type: 'expense' as const,
      description: `Netflix Premium - ${date.toLocaleDateString('es-GT', { month: 'long', year: 'numeric' })}`,
      amount: 89.0,
      date: date,
      category: 'Entretenimiento',
      status: 'completed',
      recurrenceRuleId: netflixRule.id,
      isFixedExpense: true,
      paymentMethod: 'card' as const,
      subtype: 'fixed' as const,
    });
  }

  await prisma.transaction.createMany({ data: netflixTransactions });
  console.log(`✅ Created ${netflixTransactions.length} Netflix transactions`);

  // Additional one-time transactions
  console.log('💰 Creating one-time transactions...');

  const oneTimeTransactions = [
    {
      userId: user.id,
      type: 'income' as const,
      description: 'Bono de fin de año',
      amount: 2000.0,
      date: new Date('2024-12-20'),
      category: 'Bonus',
      status: 'completed',
      incomeSource: 'primary_job' as const,
      isRecurring: false,
      subtype: 'bonus' as const,
    },
    {
      userId: user.id,
      type: 'expense' as const,
      description: 'Cena restaurante',
      amount: 350.0,
      date: new Date('2025-01-10'),
      category: 'Comida',
      status: 'completed',
      paymentMethod: 'card' as const,
      isFixedExpense: false,
      subtype: 'variable' as const,
    },
    {
      userId: user.id,
      type: 'expense' as const,
      description: 'Gasolina',
      amount: 250.0,
      date: new Date('2025-01-12'),
      category: 'Transporte',
      status: 'completed',
      paymentMethod: 'cash' as const,
      isFixedExpense: false,
      subtype: 'variable' as const,
    },
  ];

  await prisma.transaction.createMany({ data: oneTimeTransactions });
  console.log(`✅ Created ${oneTimeTransactions.length} one-time transactions`);

  // Future pending transactions (Ghost Transactions)
  console.log('👻 Creating future pending transactions...');

  const futureTransactions: any[] = [];

  // Future Salaries (next 3 months)
  for (let i = 1; i <= 3; i++) {
    const date = new Date(today);
    date.setMonth(today.getMonth() + i);
    date.setDate(15);

    futureTransactions.push({
      userId: user.id,
      type: 'income' as const,
      description: `Salario Mensual - ${date.toLocaleDateString('es-GT', { month: 'long', year: 'numeric' })}`,
      amount: 8500.0,
      date: date,
      category: 'Salario',
      status: 'pending',
      recurrenceRuleId: salaryRule.id,
      incomeSource: 'primary_job' as const,
      isRecurring: true,
      subtype: 'salary' as const,
    });
  }

  // Future Rent (next 3 months)
  for (let i = 1; i <= 3; i++) {
    const date = new Date(today);
    date.setMonth(today.getMonth() + i);
    date.setDate(1);

    futureTransactions.push({
      userId: user.id,
      type: 'expense' as const,
      description: `Renta Apartamento - ${date.toLocaleDateString('es-GT', { month: 'long', year: 'numeric' })}`,
      amount: 2500.0,
      date: date,
      category: 'Vivienda',
      status: 'pending',
      recurrenceRuleId: rentRule.id,
      isFixedExpense: true,
      paymentMethod: 'cash' as const,
      subtype: 'fixed' as const,
    });
  }

  // Future Netflix (next 3 months)
  for (let i = 1; i <= 3; i++) {
    const date = new Date(today);
    date.setMonth(today.getMonth() + i);
    date.setDate(5);

    futureTransactions.push({
      userId: user.id,
      type: 'expense' as const,
      description: `Netflix Premium - ${date.toLocaleDateString('es-GT', { month: 'long', year: 'numeric' })}`,
      amount: 89.0,
      date: date,
      category: 'Entretenimiento',
      status: 'pending',
      recurrenceRuleId: netflixRule.id,
      isFixedExpense: true,
      paymentMethod: 'card' as const,
      subtype: 'fixed' as const,
    });
  }

  // Future Groceries (bi-weekly for 3 months)
  const futureGroceryDate = new Date(today);
  futureGroceryDate.setDate(futureGroceryDate.getDate() + (8 - futureGroceryDate.getDay()));
  const threeMonthsLater = new Date(today);
  threeMonthsLater.setMonth(today.getMonth() + 3);

  while (futureGroceryDate < threeMonthsLater) {
    futureTransactions.push({
      userId: user.id,
      type: 'expense' as const,
      description: `Compras Supermercado - ${futureGroceryDate.toLocaleDateString('es-GT')}`,
      amount: 600.0,
      date: new Date(futureGroceryDate),
      category: 'Comida',
      status: 'pending',
      recurrenceRuleId: groceryRule.id,
      isFixedExpense: false,
      paymentMethod: 'cash' as const,
      subtype: 'variable' as const,
    });
    futureGroceryDate.setDate(futureGroceryDate.getDate() + 14);
  }

  await prisma.transaction.createMany({ data: futureTransactions });
  console.log(`✅ Created ${futureTransactions.length} future pending transactions`);

  // Summary
  const totalTransactions = await prisma.transaction.count();
  const completedCount = await prisma.transaction.count({ where: { status: 'completed' } });
  const pendingCount = await prisma.transaction.count({ where: { status: 'pending' } });

  console.log('\n📈 Seeding Summary:');
  console.log(`   Users: 1`);
  console.log(`   RecurrenceRules: 4`);
  console.log(`   Total Transactions: ${totalTransactions}`);
  console.log(`   - Completed: ${completedCount}`);
  console.log(`   - Pending (Ghost): ${pendingCount}`);
  console.log('\n✨ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });