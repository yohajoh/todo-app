// app/api/auth/signup/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // 1. Validate input
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // 4. Create new user in the database
    const newUser = await prisma.user.create({
      data: {
        name: name, // Name is optional in your schema, so it can be null
        email: email,
        password: hashedPassword,
      },
      select: { // Select only necessary fields to return
        id: true,
        email: true,
        name: true,
      },
    });

    return NextResponse.json({ message: 'User registered successfully!', user: newUser }, { status: 201 });

  } catch (error) {
    console.error('Sign-up API error:', error);
    // Return a JSON error response even for unexpected errors
    return NextResponse.json({ error: 'Internal server error during sign-up' }, { status: 500 });
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client
  }
}