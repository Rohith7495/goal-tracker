import { NextRequest, NextResponse } from 'next/server';
import { goalsDB, getEmailFromToken } from '@/lib/storage';

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

  const userGoals = goalsDB.get(email) || [];
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

  let userGoals = goalsDB.get(email) || [];
  const filteredGoals = userGoals.filter((g) => g.id !== id);

  if (userGoals.length === filteredGoals.length) {
    return NextResponse.json({ message: 'Goal not found' }, { status: 404 });
  }

  goalsDB.set(email, filteredGoals);

  return NextResponse.json({ message: 'Goal deleted' });
}
