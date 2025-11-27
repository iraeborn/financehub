import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const GoalSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  targetAmount: z.number().positive(),
  currentAmount: z.number().default(0),
  targetDate: z.string().transform((str) => new Date(str)),
  type: z.enum(['savings', 'expense_limit', 'debt_reduction']),
  category: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const type = searchParams.get('type')
    const isActive = searchParams.get('isActive')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const where: any = { userId }
    if (type) where.type = type
    if (isActive !== null) where.isActive = isActive === 'true'

    const goals = await db.goal.findMany({
      where,
      orderBy: { targetDate: 'asc' },
    })

    return NextResponse.json(goals)
  } catch (error) {
    console.error('Error fetching goals:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = GoalSchema.parse(body)

    const goal = await db.goal.create({
      data: {
        ...validatedData,
        userId: body.userId,
      },
    })

    return NextResponse.json(goal, { status: 201 })
  } catch (error) {
    console.error('Error creating goal:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}