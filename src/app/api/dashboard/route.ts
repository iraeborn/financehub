import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Dados de demonstração baseados nos dados do seed
    const monthlySummary = {
      income: 10000.00, // Salário (8000) + Freelance (2000)
      expense: 2950.00,  // Aluguel (2000) + Supermercado (450) + Combustível (200) + Plano de Saúde (300)
      balance: 7050.00
    }

    // Saldo total das contas (dados do seed)
    const totalBalance = 20500.00 // Conta Corrente (5000) + Poupança (15000) + Carteira (500)

    // Limite total dos cartões (dados do seed)
    const totalCreditLimit = 8000.00 // Visa (5000) + Mastercard (3000)

    // Faturas abertas (dados do seed)
    const openInvoices = 1

    // Metas ativas (dados do seed)
    const activeGoals = 3

    // Parcelamentos futuros (dados do seed)
    const futureInstallments = 2

    // Notificações não lidas (dados do seed)
    const unreadNotifications = 2

    // Evolução mensal simulada para demonstração
    const monthlyEvolution = [
      { month: 'ago/2024', income: 8500, expense: 3200, balance: 5300 },
      { month: 'set/2024', income: 9200, expense: 2800, balance: 6400 },
      { month: 'out/2024', income: 8800, expense: 3500, balance: 5300 },
      { month: 'nov/2024', income: 9500, expense: 2900, balance: 6600 },
      { month: 'dez/2024', income: 10200, expense: 3100, balance: 7100 },
      { month: 'jan/2025', income: 10000, expense: 2950, balance: 7050 }
    ]

    // Despesas por categoria (dados do seed)
    const expensesByCategory = [
      { categoryId: 'cat-4', amount: 2000.00 }, // Moradia (Aluguel)
      { categoryId: 'cat-5', amount: 450.00 },  // Alimentação (Supermercado)
      { categoryId: 'cat-6', amount: 200.00 },  // Transporte (Combustível)
      { categoryId: 'cat-7', amount: 300.00 },  // Saúde (Plano de Saúde)
    ]

    const dashboardData = {
      monthlySummary,
      totalBalance,
      totalCreditLimit,
      openInvoices,
      activeGoals,
      futureInstallments,
      unreadNotifications,
      monthlyEvolution,
      expensesByCategory,
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}