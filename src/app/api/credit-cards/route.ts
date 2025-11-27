import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const CreditCardSchema = z.object({
  name: z.string().min(1),
  brand: z.enum(['visa', 'mastercard', 'elo', 'amex', 'hipercard', 'discover']),
  lastFourDigits: z.string().length(4),
  limit: z.number().positive(),
  closingDay: z.number().min(1).max(31),
  dueDay: z.number().min(1).max(31),
  description: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const creditCards = await db.creditCard.findMany({
      where: { 
        userId,
        isActive: true 
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(creditCards)
  } catch (error) {
    console.error('Error fetching credit cards:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = CreditCardSchema.parse(body)

    const creditCard = await db.creditCard.create({
      data: {
        ...validatedData,
        userId: body.userId,
      },
    })

    return NextResponse.json(creditCard, { status: 201 })
  } catch (error) {
    console.error('Error creating credit card:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}