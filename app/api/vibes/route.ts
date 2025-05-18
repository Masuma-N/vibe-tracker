import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const vibes = await prisma.vibe.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(vibes); // Return array directly
}
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { mood, note } = body;

    if (!mood) {
      return NextResponse.json({ error: 'Mood is required' }, { status: 400 });
    }

    const newVibe = await prisma.vibe.create({
      data: {
        mood,
        note,
      },
    });

    return NextResponse.json(newVibe, { status: 201 });
  } catch (error) {
    console.error('POST /api/vibes error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
