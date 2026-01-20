import { NextRequest, NextResponse } from 'next/server';
import { goalsDB, getEmailFromToken } from '@/lib/storage';

export async function GET(request: NextRequest) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const email = getEmailFromToken(token);
  const userGoals = goalsDB.get(email) || [];

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

  const newGoal = {
    id: Date.now().toString(),
    title,
    description: description || '',
    completed: false,
    createdAt: new Date().toISOString(),
    userId: email,
  };

  if (!goalsDB.has(email)) {
    goalsDB.set(email, []);
  }

  goalsDB.get(email)?.push(newGoal);

  return NextResponse.json(newGoal);
}
