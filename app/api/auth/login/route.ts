import { NextRequest, NextResponse } from 'next/server';
import { usersDB } from '@/lib/storage';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { message: 'Email and password are required' },
      { status: 400 }
    );
  }

  const user = usersDB.get(email);

  if (!user || user.password !== password) {
    return NextResponse.json(
      { message: 'Invalid email or password' },
      { status: 401 }
    );
  }

  // Generate a simple token
  const token = Buffer.from(email).toString('base64');

  return NextResponse.json({ token, email });
}
