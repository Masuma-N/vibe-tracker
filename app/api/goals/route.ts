import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const goals = await prisma.goal.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(goals);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const newGoal = await prisma.goal.create({
      data: { text },
    });

    return NextResponse.json(newGoal, { status: 201 });
  } catch (error) {
    console.error('POST /api/goals error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 
