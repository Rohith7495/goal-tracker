import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory storage for demo
const users: Map<string, { email: string; password: string }> = new Map();

// Simulating a user for testing
users.set('test@example.com', { email: 'test@example.com', password: 'password123' });

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { message: 'Email and password are required' },
      { status: 400 }
    );
  }

  const user = users.get(email);

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
