import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models';

function getEmailFromToken(token: string): string {
  try {
    return Buffer.from(token, 'base64').toString('utf-8');
  } catch {
    return '';
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
    const requestingUser = await User.findOne({ email });

    // Check if the first user (existing admin check)
    // For safety, only the first user can promote others
    const firstUser = await User.findOne().sort({ createdAt: 1 });
    if (!requestingUser || requestingUser._id.toString() !== firstUser?._id.toString()) {
      return NextResponse.json(
        { message: 'Forbidden: Only the first user can promote admins' },
        { status: 403 }
      );
    }

    const { targetEmail } = await request.json();

    if (!targetEmail) {
      return NextResponse.json(
        { message: 'Target email is required' },
        { status: 400 }
      );
    }

    const targetUser = await User.findOne({ email: targetEmail });
    if (!targetUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    targetUser.isAdmin = true;
    await targetUser.save();

    return NextResponse.json({
      message: `User ${targetEmail} promoted to admin`,
      email: targetEmail,
    });
  } catch (error) {
    console.error('Error promoting user:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
