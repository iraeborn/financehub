import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const InvoiceSchema = z.object({
  month: z.number().min(1).max(12),
  year: z.number().min(2000).max(2100),
  openingBalance: z.number().default(0),
  totalPurchases: z.number().default(0),
  totalPayments: z.number().default(0),
  closingBalance: z.number().default(0),
  minimumPayment: z.number().optional(),
  dueDate: z.string().transform((str) => new Date(str)),
  status: z.enum(['open', 'closed', 'paid', 'overdue']).default('open'),
  creditCardId: z.string(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const creditCardId = searchParams.get('creditCardId')
    const status = searchParams.get('status')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const where: any = { userId }
    if (creditCardId) where.creditCardId = creditCardId
    if (status) where.status = status

    const invoices = await db.invoice.findMany({
      where,
      include: {
        creditCard: true,
        installments: true,
      },
      orderBy: [
        { year: 'desc' },
        { month: 'desc' },
      ],
    })

    return NextResponse.json(invoices)
  } catch (error) {
    console.error('Error fetching invoices:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = InvoiceSchema.parse(body)

    const invoice = await db.invoice.create({
      data: {
        ...validatedData,
        userId: body.userId,
      },
      include: {
        creditCard: true,
        installments: true,
      },
    })

    return NextResponse.json(invoice, { status: 201 })
  } catch (error) {
    console.error('Error creating invoice:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}