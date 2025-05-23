import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const goals = await prisma.goal.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(goals);
  } catch (error) {
    console.error('GET /api/goals error:', error);
    return NextResponse.json({ error: 'Failed to load goals' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const { completed } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing goal ID' }, { status: 400 });
    }

    const updatedGoal = await prisma.goal.update({
      where: { id },
      data: { completed },
    });

    return NextResponse.json(updatedGoal);
  } catch (error) {
    console.error('PATCH /api/goals/:id error:', error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
} 
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing goal ID' }, { status: 400 });
    }

    await prisma.goal.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/goals error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
} 
export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Goal text is required' }, { status: 400 });
    }

    const newGoal = await prisma.goal.create({
      data: {
        text,
        completed: false,
      },
    });

    return NextResponse.json(newGoal, { status: 201 });
  } catch (error) {
    console.error('POST /api/goals error:', error);
    return NextResponse.json({ error: 'Failed to create goal' }, { status: 500 });
  }
} 



