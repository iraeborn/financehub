import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const TransactionSchema = z.object({
  description: z.string().min(1),
  amount: z.number().positive(),
  type: z.enum(['income', 'expense']),
  date: z.string().transform((str) => new Date(str)),
  accountId: z.string(),
  categoryId: z.string(),
  creditCardId: z.string().optional(),
  notes: z.string().optional(),
  isRecurring: z.boolean().default(false),
  recurringInterval: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const type = searchParams.get('type')
    const categoryId = searchParams.get('categoryId')
    const accountId = searchParams.get('accountId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const where: any = { userId }

    if (type) where.type = type
    if (categoryId) where.categoryId = categoryId
    if (accountId) where.accountId = accountId
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    }

    const transactions = await db.transaction.findMany({
      where,
      include: {
        account: true,
        category: true,
        creditCard: true,
        installment: true,
      },
      orderBy: { date: 'desc' },
    })

    return NextResponse.json(transactions)
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = TransactionSchema.parse(body)

    const transaction = await db.transaction.create({
      data: {
        ...validatedData,
        userId: body.userId,
      },
      include: {
        account: true,
        category: true,
        creditCard: true,
      },
    })

    // Atualizar saldo da conta
    const account = await db.account.findUnique({
      where: { id: validatedData.accountId },
    })

    if (account) {
      const newBalance = validatedData.type === 'income' 
        ? account.balance + validatedData.amount
        : account.balance - validatedData.amount

      await db.account.update({
        where: { id: validatedData.accountId },
        data: { balance: newBalance },
      })
    }

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    console.error('Error creating transaction:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}