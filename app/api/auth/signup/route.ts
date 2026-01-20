import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory storage for demo (replace with MongoDB in production)
const users: Map<string, { email: string; password: string }> = new Map();

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { message: 'Email and password are required' },
      { status: 400 }
    );
  }

  if (users.has(email)) {
    return NextResponse.json(
      { message: 'User already exists' },
      { status: 400 }
    );
  }

  users.set(email, { email, password });

  // Generate a simple token (in production, use proper JWT)
  const token = Buffer.from(email).toString('base64');

  return NextResponse.json({ token, email });
}
