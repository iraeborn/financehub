import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const CategorySchema = z.object({
  name: z.string().min(1),
  type: z.enum(['income', 'expense']),
  color: z.string().optional(),
  icon: z.string().optional(),
  description: z.string().optional(),
  parentId: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const type = searchParams.get('type')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const where: any = { userId }
    if (type) where.type = type

    const categories = await db.category.findMany({
      where,
      include: {
        parent: true,
        children: true,
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = CategorySchema.parse(body)

    const category = await db.category.create({
      data: {
        ...validatedData,
        userId: body.userId,
      },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}