import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory storage
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const email = getEmailFromToken(token);
  const { id } = await params;
  const { completed } = await request.json();

  const userGoals = goals.get(email) || [];
  const goal = userGoals.find((g) => g.id === id);

  if (!goal) {
    return NextResponse.json({ message: 'Goal not found' }, { status: 404 });
  }

  goal.completed = completed;

  return NextResponse.json(goal);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const email = getEmailFromToken(token);
  const { id } = await params;

  let userGoals = goals.get(email) || [];
  const filteredGoals = userGoals.filter((g) => g.id !== id);

  if (userGoals.length === filteredGoals.length) {
    return NextResponse.json({ message: 'Goal not found' }, { status: 404 });
  }

  goals.set(email, filteredGoals);

  return NextResponse.json({ message: 'Goal deleted' });
}
