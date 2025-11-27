import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

interface InstallmentCalculationRequest {
  totalAmount: number
  totalInstallments: number
  interestRate?: number
  interestType?: 'simple' | 'compound'
  firstPaymentDate: string
}

interface InstallmentCalculationResponse {
  installments: Array<{
    number: number
    amount: number
    dueDate: string
    balance: number
  }>
  totalInterest: number
  totalAmount: number
  effectiveRate: number
}

export async function POST(request: NextRequest) {
  try {
    const body: InstallmentCalculationRequest = await request.json()
    const { totalAmount, totalInstallments, interestRate = 0, interestType = 'simple', firstPaymentDate } = body

    const installments = []
    let totalInterest = 0
    let totalPayable = totalAmount

    if (interestType === 'simple') {
      // Juros simples
      totalInterest = totalAmount * (interestRate / 100) * (totalInstallments / 12)
      totalPayable = totalAmount + totalInterest
      const installmentAmount = totalPayable / totalInstallments

      for (let i = 1; i <= totalInstallments; i++) {
        const dueDate = new Date(firstPaymentDate)
        dueDate.setMonth(dueDate.getMonth() + i - 1)
        
        installments.push({
          number: i,
          amount: installmentAmount,
          dueDate: dueDate.toISOString(),
          balance: totalPayable - (installmentAmount * i),
        })
      }
    } else {
      // Juros compostos
      const monthlyRate = interestRate / 100 / 12
      const installmentAmount = totalAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalInstallments)) / 
                               (Math.pow(1 + monthlyRate, totalInstallments) - 1)
      
      let remainingBalance = totalAmount

      for (let i = 1; i <= totalInstallments; i++) {
        const interestPayment = remainingBalance * monthlyRate
        const principalPayment = installmentAmount - interestPayment
        remainingBalance -= principalPayment
        totalInterest += interestPayment

        const dueDate = new Date(firstPaymentDate)
        dueDate.setMonth(dueDate.getMonth() + i - 1)
        
        installments.push({
          number: i,
          amount: installmentAmount,
          dueDate: dueDate.toISOString(),
          balance: Math.max(0, remainingBalance),
        })
      }

      totalPayable = installmentAmount * totalInstallments
    }

    const effectiveRate = ((totalPayable - totalAmount) / totalAmount) * 100

    const response: InstallmentCalculationResponse = {
      installments,
      totalInterest,
      totalAmount: totalPayable,
      effectiveRate,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error calculating installments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Obter dados para análise financeira
    const currentDate = new Date()
    const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    const nextYear = new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), 0)

    // Transações dos últimos 6 meses
    const recentTransactions = await db.transaction.findMany({
      where: {
        userId,
        date: {
          gte: new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1),
          lte: currentDate,
        },
      },
      include: {
        category: true,
      },
    })

    // Parcelamentos futuros
    const futureInstallments = await db.installment.findMany({
      where: {
        userId,
        status: 'pending',
        dueDate: {
          gte: currentDate,
          lte: nextYear,
        },
      },
      orderBy: { dueDate: 'asc' },
    })

    // Metas financeiras
    const goals = await db.goal.findMany({
      where: {
        userId,
        isActive: true,
      },
    })

    // Análise de gastos por categoria
    const expensesByCategory = recentTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, transaction) => {
        const categoryName = transaction.category.name
        if (!acc[categoryName]) {
          acc[categoryName] = 0
        }
        acc[categoryName] += transaction.amount
        return acc
      }, {} as Record<string, number>)

    // Cálculo de ticket médio
    const totalExpenses = recentTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
    const expenseCount = recentTransactions.filter(t => t.type === 'expense').length
    const averageTicket = expenseCount > 0 ? totalExpenses / expenseCount : 0

    // Detecção de gastos anormais (acima de 2 desvios padrão)
    const expenseAmounts = recentTransactions
      .filter(t => t.type === 'expense')
      .map(t => t.amount)
    
    const mean = expenseAmounts.reduce((sum, amount) => sum + amount, 0) / expenseAmounts.length
    const variance = expenseAmounts.reduce((sum, amount) => sum + Math.pow(amount - mean, 2), 0) / expenseAmounts.length
    const standardDeviation = Math.sqrt(variance)
    const threshold = mean + (2 * standardDeviation)

    const abnormalExpenses = recentTransactions.filter(t => 
      t.type === 'expense' && t.amount > threshold
    )

    // Projeção de saldo futuro
    const monthlyIncome = recentTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0) / 6
    
    const monthlyExpenses = recentTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0) / 6

    const monthlyInstallments = futureInstallments.reduce((sum, installment) => 
      sum + installment.installmentAmount, 0) / 12

    const projectedMonthlyBalance = monthlyIncome - monthlyExpenses - monthlyInstallments

    // Risco de endividamento
    const totalCreditLimit = await db.creditCard.aggregate({
      where: { userId, isActive: true },
      _sum: { limit: true },
    })

    const totalCreditBalance = await db.creditCard.aggregate({
      where: { userId, isActive: true },
      _sum: { currentBalance: true },
    })

    const creditUtilization = totalCreditLimit._sum.limit ? 
      (totalCreditBalance._sum.currentBalance || 0) / totalCreditLimit._sum.limit : 0

    const debtRiskLevel = creditUtilization > 0.7 ? 'high' : 
                         creditUtilization > 0.5 ? 'medium' : 'low'

    // Tendência anual
    const currentYear = currentDate.getFullYear()
    const lastYear = currentYear - 1

    const currentYearTransactions = recentTransactions.filter(t => 
      t.date.getFullYear() === currentYear
    )
    const lastYearTransactions = recentTransactions.filter(t => 
      t.date.getFullYear() === lastYear
    )

    const currentYearIncome = currentYearTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const lastYearIncome = lastYearTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const incomeGrowthRate = lastYearIncome > 0 ? 
      ((currentYearIncome - lastYearIncome) / lastYearIncome) * 100 : 0

    const financialAnalysis = {
      expensesByCategory,
      averageTicket,
      abnormalExpenses: abnormalExpenses.map(t => ({
        id: t.id,
        description: t.description,
        amount: t.amount,
        date: t.date,
        category: t.category.name,
      })),
      projectedMonthlyBalance,
      projectedAnnualBalance: projectedMonthlyBalance * 12,
      debtRisk: {
        level: debtRiskLevel,
        creditUtilization: creditUtilization * 100,
        totalCreditLimit: totalCreditLimit._sum.limit || 0,
        totalCreditBalance: totalCreditBalance._sum.currentBalance || 0,
      },
      trends: {
        incomeGrowthRate,
        monthlyIncome,
        monthlyExpenses,
        monthlyInstallments,
      },
      goalsProgress: goals.map(goal => ({
        id: goal.id,
        title: goal.title,
        progress: (goal.currentAmount / goal.targetAmount) * 100,
        targetDate: goal.targetDate,
        type: goal.type,
      })),
    }

    return NextResponse.json(financialAnalysis)
  } catch (error) {
    console.error('Error performing financial analysis:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}