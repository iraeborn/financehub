import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seeding...')

  // Criar usuário de exemplo
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'João Silva',
      phone: '+55 11 99999-9999',
    },
  })

  console.log('Created user:', user)

  // Criar contas de exemplo
  const accounts = await Promise.all([
    prisma.account.upsert({
      where: { id: 'acc-1' },
      update: {},
      create: {
        id: 'acc-1',
        name: 'Conta Corrente',
        type: 'checking',
        balance: 5000.00,
        bank: 'Banco do Brasil',
        agency: '1234',
        account: '56789-0',
        description: 'Conta principal',
        userId: user.id,
      },
    }),
    prisma.account.upsert({
      where: { id: 'acc-2' },
      update: {},
      create: {
        id: 'acc-2',
        name: 'Poupança',
        type: 'savings',
        balance: 15000.00,
        bank: 'Caixa Econômica',
        agency: '4321',
        account: '98765-4',
        description: 'Poupança para emergências',
        userId: user.id,
      },
    }),
    prisma.account.upsert({
      where: { id: 'acc-3' },
      update: {},
      create: {
        id: 'acc-3',
        name: 'Carteira',
        type: 'cash',
        balance: 500.00,
        description: 'Dinheiro em mãos',
        userId: user.id,
      },
    }),
  ])

  console.log('Created accounts:', accounts)

  // Criar categorias de exemplo
  const categories = await Promise.all([
    // Categorias de Receita
    prisma.category.upsert({
      where: { id: 'cat-1' },
      update: {},
      create: {
        id: 'cat-1',
        name: 'Salário',
        type: 'income',
        color: '#10b981',
        icon: 'briefcase',
        isDefault: true,
        userId: user.id,
      },
    }),
    prisma.category.upsert({
      where: { id: 'cat-2' },
      update: {},
      create: {
        id: 'cat-2',
        name: 'Freelance',
        type: 'income',
        color: '#3b82f6',
        icon: 'laptop',
        isDefault: true,
        userId: user.id,
      },
    }),
    prisma.category.upsert({
      where: { id: 'cat-3' },
      update: {},
      create: {
        id: 'cat-3',
        name: 'Investimentos',
        type: 'income',
        color: '#8b5cf6',
        icon: 'trending-up',
        isDefault: true,
        userId: user.id,
      },
    }),
    
    // Categorias de Despesa
    prisma.category.upsert({
      where: { id: 'cat-4' },
      update: {},
      create: {
        id: 'cat-4',
        name: 'Moradia',
        type: 'expense',
        color: '#ef4444',
        icon: 'home',
        isDefault: true,
        userId: user.id,
      },
    }),
    prisma.category.upsert({
      where: { id: 'cat-5' },
      update: {},
      create: {
        id: 'cat-5',
        name: 'Alimentação',
        type: 'expense',
        color: '#f59e0b',
        icon: 'utensils',
        isDefault: true,
        userId: user.id,
      },
    }),
    prisma.category.upsert({
      where: { id: 'cat-6' },
      update: {},
      create: {
        id: 'cat-6',
        name: 'Transporte',
        type: 'expense',
        color: '#06b6d4',
        icon: 'car',
        isDefault: true,
        userId: user.id,
      },
    }),
    prisma.category.upsert({
      where: { id: 'cat-7' },
      update: {},
      create: {
        id: 'cat-7',
        name: 'Saúde',
        type: 'expense',
        color: '#ec4899',
        icon: 'heart',
        isDefault: true,
        userId: user.id,
      },
    }),
    prisma.category.upsert({
      where: { id: 'cat-8' },
      update: {},
      create: {
        id: 'cat-8',
        name: 'Educação',
        type: 'expense',
        color: '#6366f1',
        icon: 'book',
        isDefault: true,
        userId: user.id,
      },
    }),
    prisma.category.upsert({
      where: { id: 'cat-9' },
      update: {},
      create: {
        id: 'cat-9',
        name: 'Lazer',
        type: 'expense',
        color: '#84cc16',
        icon: 'gamepad-2',
        isDefault: true,
        userId: user.id,
      },
    }),
  ])

  console.log('Created categories:', categories)

  // Criar cartões de crédito de exemplo
  const creditCards = await Promise.all([
    prisma.creditCard.upsert({
      where: { id: 'card-1' },
      update: {},
      create: {
        id: 'card-1',
        name: 'Visa Final 1234',
        brand: 'visa',
        lastFourDigits: '1234',
        limit: 5000.00,
        currentBalance: 1200.00,
        closingDay: 10,
        dueDay: 25,
        description: 'Cartão Visa principal',
        userId: user.id,
      },
    }),
    prisma.creditCard.upsert({
      where: { id: 'card-2' },
      update: {},
      create: {
        id: 'card-2',
        name: 'Mastercard Final 5678',
        brand: 'mastercard',
        lastFourDigits: '5678',
        limit: 3000.00,
        currentBalance: 800.00,
        closingDay: 15,
        dueDay: 5,
        description: 'Cartão Mastercard secundário',
        userId: user.id,
      },
    }),
  ])

  console.log('Created credit cards:', creditCards)

  // Criar transações de exemplo
  const transactions = await Promise.all([
    // Receitas
    prisma.transaction.create({
      data: {
        description: 'Salário Mensal',
        amount: 8000.00,
        type: 'income',
        date: new Date('2024-01-05'),
        accountId: accounts[0].id,
        categoryId: categories[0].id,
        userId: user.id,
      },
    }),
    prisma.transaction.create({
      data: {
        description: 'Projeto Freelance',
        amount: 2000.00,
        type: 'income',
        date: new Date('2024-01-15'),
        accountId: accounts[0].id,
        categoryId: categories[1].id,
        userId: user.id,
      },
    }),
    
    // Despesas
    prisma.transaction.create({
      data: {
        description: 'Aluguel',
        amount: 2000.00,
        type: 'expense',
        date: new Date('2024-01-10'),
        accountId: accounts[0].id,
        categoryId: categories[3].id,
        userId: user.id,
      },
    }),
    prisma.transaction.create({
      data: {
        description: 'Supermercado',
        amount: 450.00,
        type: 'expense',
        date: new Date('2024-01-12'),
        accountId: accounts[0].id,
        categoryId: categories[4].id,
        userId: user.id,
      },
    }),
    prisma.transaction.create({
      data: {
        description: 'Combustível',
        amount: 200.00,
        type: 'expense',
        date: new Date('2024-01-14'),
        accountId: accounts[2].id,
        categoryId: categories[5].id,
        userId: user.id,
      },
    }),
    prisma.transaction.create({
      data: {
        description: 'Plano de Saúde',
        amount: 300.00,
        type: 'expense',
        date: new Date('2024-01-05'),
        accountId: accounts[0].id,
        categoryId: categories[6].id,
        userId: user.id,
        isRecurring: true,
        recurringInterval: 'monthly',
      },
    }),
  ])

  console.log('Created transactions:', transactions)

  // Criar metas de exemplo
  const goals = await Promise.all([
    prisma.goal.create({
      data: {
        title: 'Fundo de Emergência',
        description: 'Economizar 6 meses de despesas',
        targetAmount: 30000.00,
        currentAmount: 15000.00,
        targetDate: new Date('2024-12-31'),
        type: 'savings',
        userId: user.id,
      },
    }),
    prisma.goal.create({
      data: {
        title: 'Limitar Despesas com Lazer',
        description: 'Não gastar mais de R$ 500 por mês com lazer',
        targetAmount: 500.00,
        currentAmount: 0.00,
        targetDate: new Date('2024-12-31'),
        type: 'expense_limit',
        category: 'Lazer',
        userId: user.id,
      },
    }),
    prisma.goal.create({
      data: {
        title: 'Quitar Fatura do Cartão',
        description: 'Pagar toda a fatura do cartão Visa',
        targetAmount: 1200.00,
        currentAmount: 0.00,
        targetDate: new Date('2024-02-25'),
        type: 'debt_reduction',
        userId: user.id,
      },
    }),
  ])

  console.log('Created goals:', goals)

  // Criar faturas de exemplo
  const invoices = await Promise.all([
    prisma.invoice.create({
      data: {
        month: 1,
        year: 2024,
        openingBalance: 800.00,
        totalPurchases: 1200.00,
        totalPayments: 800.00,
        closingBalance: 1200.00,
        minimumPayment: 120.00,
        dueDate: new Date('2024-01-25'),
        status: 'open',
        creditCardId: creditCards[0].id,
        userId: user.id,
      },
    }),
    prisma.invoice.create({
      data: {
        month: 12,
        year: 2023,
        openingBalance: 500.00,
        totalPurchases: 800.00,
        totalPayments: 500.00,
        closingBalance: 800.00,
        minimumPayment: 80.00,
        dueDate: new Date('2024-01-05'),
        status: 'paid',
        creditCardId: creditCards[1].id,
        userId: user.id,
      },
    }),
  ])

  console.log('Created invoices:', invoices)

  // Criar parcelamentos de exemplo
  const installments = await Promise.all([
    prisma.installment.create({
      data: {
        totalAmount: 3000.00,
        installmentAmount: 500.00,
        installmentNumber: 1,
        totalInstallments: 6,
        interestRate: 2.5,
        interestType: 'simple',
        dueDate: new Date('2024-02-10'),
        originalTransactionId: 'trans-1',
        creditCardId: creditCards[0].id,
        invoiceId: invoices[0].id,
        userId: user.id,
        status: 'pending',
      },
    }),
    prisma.installment.create({
      data: {
        totalAmount: 3000.00,
        installmentAmount: 500.00,
        installmentNumber: 2,
        totalInstallments: 6,
        interestRate: 2.5,
        interestType: 'simple',
        dueDate: new Date('2024-03-10'),
        originalTransactionId: 'trans-1',
        creditCardId: creditCards[0].id,
        userId: user.id,
        status: 'pending',
      },
    }),
  ])

  console.log('Created installments:', installments)

  // Criar notificações de exemplo
  const notifications = await Promise.all([
    prisma.notification.create({
      data: {
        title: 'Fatura Próxima do Vencimento',
        message: 'Sua fatura do cartão Visa vence em 3 dias',
        type: 'warning',
        userId: user.id,
      },
    }),
    prisma.notification.create({
      data: {
        title: 'Meta de Economia',
        message: 'Você está a 50% da sua meta de fundo de emergência',
        type: 'success',
        userId: user.id,
        goalId: goals[0].id,
      },
    }),
  ])

  console.log('Created notifications:', notifications)

  console.log('Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })