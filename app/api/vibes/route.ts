import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { mood, note } = await req.json();

    if (!mood) {
      return NextResponse.json({ error: 'Mood is required' }, { status: 400 });
    }

    const newVibe = await prisma.vibe.create({
      data: { mood, note },
    });

    return NextResponse.json(newVibe);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const vibes = await prisma.vibe.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(vibes);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 
