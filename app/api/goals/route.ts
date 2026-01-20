import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory storage for demo
interface Goal {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  userId: string;
}

const goals: Map<string, Goal[]> = new Map();

function getEmailFromToken(token: string): string {
  try {
    return Buffer.from(token, 'base64').toString('utf-8');
  } catch {
    return '';
  }
}

export async function GET(request: NextRequest) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const email = getEmailFromToken(token);
  const userGoals = goals.get(email) || [];

  return NextResponse.json(userGoals);
}

export async function POST(request: NextRequest) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const email = getEmailFromToken(token);
  const { title, description } = await request.json();

  if (!title) {
    return NextResponse.json(
      { message: 'Title is required' },
      { status: 400 }
    );
  }

  const newGoal: Goal = {
    id: Date.now().toString(),
    title,
    description: description || '',
    completed: false,
    createdAt: new Date().toISOString(),
    userId: email,
  };

  if (!goals.has(email)) {
    goals.set(email, []);
  }

  goals.get(email)?.push(newGoal);

  return NextResponse.json(newGoal);
}
