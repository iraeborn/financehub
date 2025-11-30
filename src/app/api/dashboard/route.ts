import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // === Total de Receitas e Despesas do mês atual ==
    const year = new Date().getFullYear();
    const month = new Date().getMonth();

    const transactions = await db.transaction.findMany({
      where: {
        userId,
        date: {
          gte: new Date(year, month, 1),
          lt: new Date(year, month + 1, 1),
        },
      },
    });

    const income = transactions.filter((t) => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0);

    const expense = transactions.filter((t) => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0);

    // === Categorias (groupBy) ===
    const expensesByCategory = await db.transaction.groupBy({
      by: ['categoryId'],
      where: {
        userId,
        type: 'EXPENSE',
        date: {
          gte: new Date(year, month, 1),
          lt: new Date(year, month + 1, 1),
        },
      },
      _sum: { amount: true },
    });

    // === Metas ativas ===
    const activeGoals = await db.goal.findMany({
      where: { userId, isActive: false },
      orderBy: { createdAt: 'desc' },
    });

    // === Faturas futuras ===
    const futureInstallments = await db.installment.findMany({
      where: {
        userId,
        dueDate: { gte: new Date() },
      },
      orderBy: { dueDate: 'asc' },
    });

    const dashboardData = {
      monthlySummary: {
        income,
        expense,
        balance: income - expense,
      },
      expensesByCategory,
      activeGoals,
      futureInstallments,
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
