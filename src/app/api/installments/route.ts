import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const InstallmentSchema = z.object({
  totalAmount: z.number().positive(),
  installmentAmount: z.number().positive(),
  installmentNumber: z.number().positive(),
  totalInstallments: z.number().positive(),
  interestRate: z.number().optional(),
  interestType: z.enum(['simple', 'compound']).optional(),
  dueDate: z.string().transform((str) => new Date(str)),
  originalTransactionId: z.string(),
  creditCardId: z.string(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')
    const creditCardId = searchParams.get('creditCardId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const where: any = { userId }
    if (status) where.status = status
    if (creditCardId) where.creditCardId = creditCardId

    const installments = await db.installment.findMany({
      where,
      include: {
        creditCard: true,
        invoice: true,
        transactions: true,
      },
      orderBy: { dueDate: 'asc' },
    })

    return NextResponse.json(installments)
  } catch (error) {
    console.error('Error fetching installments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = InstallmentSchema.parse(body)

    // Criar múltiplas parcelas
    const installments = []
    for (let i = 1; i <= validatedData.totalInstallments; i++) {
      const installment = await db.installment.create({
        data: {
          totalAmount: validatedData.totalAmount,
          installmentAmount: validatedData.installmentAmount,
          installmentNumber: i,
          totalInstallments: validatedData.totalInstallments,
          interestRate: validatedData.interestRate,
          interestType: validatedData.interestType,
          dueDate: new Date(validatedData.dueDate),
          originalTransactionId: validatedData.originalTransactionId,
          creditCardId: validatedData.creditCardId,
          userId: body.userId,
          status: 'pending',
        },
      })
      installments.push(installment)
    }

    return NextResponse.json(installments, { status: 201 })
  } catch (error) {
    console.error('Error creating installments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}