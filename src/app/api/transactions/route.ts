import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET — listar transações
export async function GET(request: Request) {
  try {
    const transactions = await db.transaction.findMany({
      orderBy: { date: 'desc' },
    });

    return NextResponse.json({ success: true, transactions });
  } catch (error) {
    console.error('GET /transactions error:', error);
    return NextResponse.json({ success: false, message: 'Erro ao buscar transações' }, { status: 500 });
  }
}

// POST — criar transação
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newTransaction = await db.transaction.create({
      data: {
        description: body.description,
        amount: body.amount,
        type: body.type,
        date: new Date(body.date),
        accountId: body.accountId,
        categoryId: body.categoryId,
        userId: body.userId,
      },
    });

    return NextResponse.json({ success: true, newTransaction });
  } catch (error) {
    console.error('POST /transactions error:', error);
    return NextResponse.json({ success: false, message: 'Erro ao criar transação' }, { status: 500 });
  }
}

// DELETE — remover transação
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID é obrigatório' }, { status: 400 });
    }

    await db.transaction.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /transactions error:', error);
    return NextResponse.json({ success: false, message: 'Erro ao deletar transação' }, { status: 500 });
  }
}
