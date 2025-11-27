import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const AccountSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['checking', 'savings', 'investment', 'cash']),
  balance: z.number().default(0),
  bank: z.string().optional(),
  agency: z.string().optional(),
  account: z.string().optional(),
  description: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const accounts = await db.account.findMany({
      where: { 
        userId,
        isActive: true 
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(accounts)
  } catch (error) {
    console.error('Error fetching accounts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = AccountSchema.parse(body)

    const account = await db.account.create({
      data: {
        ...validatedData,
        userId: body.userId,
      },
    })

    return NextResponse.json(account, { status: 201 })
  } catch (error) {
    console.error('Error creating account:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}