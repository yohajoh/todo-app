// app/api/auth/signin/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// IMPORTANT: Replace with a strong, secret key from environment variables
// Ensure process.env.JWT_SECRET is defined in your .env.local file
const JWT_SECRET = process.env.JWT_SECRET || 'f70c6707c5a26b5650b3da2df3d69bfe7e8cd9d13ec6913bdf951b503638ef5b';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // 1. Validate input
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // 2. Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // 3. Compare provided password with hashed password in DB
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // 4. Generate JWT
    // Payload for the token (don't include sensitive info like password)
    const tokenPayload = {
      userId: user.id,
      email: user.email,
    };
    // Sign the token with your secret key and set an expiry (e.g., 1 hour)
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h' });

    // 5. Return success response with token and user info
    return NextResponse.json({ message: 'Sign-in successful!', token: token, user: { id: user.id, email: user.email, name: user.name } }, { status: 200 });

  } catch (error) {
    console.error('Sign-in API error:', error);
    // Return a JSON error response even for unexpected errors
    return NextResponse.json({ error: 'Internal server error during sign-in' }, { status: 500 });
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client
  }
}