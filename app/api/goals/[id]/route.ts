import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Goal } from '@/lib/models';
import { Types } from 'mongoose';

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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const email = getEmailFromToken(token);
    const { id } = await params;
    const { completed } = await request.json();

    // Validate ObjectId
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid goal ID' }, { status: 400 });
    }

    const goal = await Goal.findOneAndUpdate(
      { _id: new Types.ObjectId(id), userId: email },
      { completed },
      { new: true }
    );

    if (!goal) {
      return NextResponse.json({ message: 'Goal not found' }, { status: 404 });
    }

    return NextResponse.json(formatGoal(goal));
  } catch (error) {
    console.error('Error updating goal:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const email = getEmailFromToken(token);
    const { id } = await params;

    // Validate ObjectId
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid goal ID' }, { status: 400 });
    }

    const goal = await Goal.findOneAndDelete({
      _id: new Types.ObjectId(id),
      userId: email,
    });

    if (!goal) {
      return NextResponse.json({ message: 'Goal not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Goal deleted' });
  } catch (error) {
    console.error('Error deleting goal:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
