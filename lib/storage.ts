// Shared in-memory storage for goals and users
export interface Goal {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  userId: string;
}

export interface User {
  email: string;
  password: string;
}

// Shared storage Maps
export const usersDB: Map<string, User> = new Map();
export const goalsDB: Map<string, Goal[]> = new Map();

// Add a test user for demo
usersDB.set('test@example.com', { email: 'test@example.com', password: 'password123' });

export function getEmailFromToken(token: string): string {
  try {
    return Buffer.from(token, 'base64').toString('utf-8');
  } catch {
    return '';
  }
}
