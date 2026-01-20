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

    const goal = await Goal.findOneAndUpdate(
      { _id: id, userId: email },
      { completed },
      { new: true }
    );

    if (!goal) {
      return NextResponse.json({ message: 'Goal not found' }, { status: 404 });
    }

    return NextResponse.json(goal);
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

    const goal = await Goal.findOneAndDelete({
      _id: id,
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
