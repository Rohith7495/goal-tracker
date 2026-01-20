import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Goal } from '@/lib/models';

function getEmailFromToken(token: string): string {
  try {
    return Buffer.from(token, 'base64').toString('utf-8');
  } catch {
    return '';
  }
}

function formatGoal(goal: any) {
  return {
    id: goal._id.toString(),
    title: goal.title,
    description: goal.description,
    completed: goal.completed,
    userId: goal.userId,
    createdAt: goal.createdAt,
  };
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const email = getEmailFromToken(token);
    const goals = await Goal.find({ userId: email }).sort({ createdAt: -1 });

    return NextResponse.json(goals.map(formatGoal));
  } catch (error) {
    console.error('Error fetching goals:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
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

    const goal = new Goal({
      title,
      description: description || '',
      completed: false,
      userId: email,
    });

    await goal.save();

    return NextResponse.json(formatGoal(goal));
  } catch (error) {
    console.error('Error creating goal:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
