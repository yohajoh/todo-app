// app/api/lists/route.ts

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
// CORRECTED IMPORT: Import your Prisma Client singleton instance from its actual location.
import prisma from '@/prisma/client'; // This should point to your `lib/prisma.ts` file
import { createTodoList } from '@/lib/actions/list'; // Import the createTodoList action

// IMPORTANT: This must match the JWT_SECRET in your .env.local file
// and in your sign-in route (app/api/auth/signin/route.ts).
const JWT_SECRET = process.env.JWT_SECRET || 'f70c6707c5a26b5650b3da2df3d69bfe7e8cd9d13ec6913bdf951b503638ef5b';

// GET handler for fetching all TodoLists for the authenticated user
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Authorization token missing or malformed in request header for GET /api/lists.');
      return NextResponse.json({ error: 'Authorization token required' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let decodedToken: { userId: number; email: string; } | null = null;

    try {
      decodedToken = jwt.verify(token, JWT_SECRET) as { userId: number; email: string; };
    } catch (jwtError) {
      console.error('JWT verification failed for GET /api/lists:', jwtError);
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    if (!decodedToken || typeof decodedToken.userId !== 'number') {
      console.error('Decoded token payload is invalid or missing userId for GET /api/lists:', decodedToken);
      return NextResponse.json({ error: 'Invalid token payload: userId missing' }, { status: 401 });
    }

    const userId = decodedToken.userId;

    // This line should now work correctly because 'prisma' is the instantiated client.
    const userLists = await prisma.todoList.findMany({
      where: {
        OR: [
          { ownerId: userId },
          {
            members: {
              some: {
                userId: userId,
              },
            },
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        description: true,
        ownerId: true,
      }
    });

    return NextResponse.json({ lists: userLists }, { status: 200 });

  } catch (error) {
    console.error('Unexpected error in GET /api/lists route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


// POST handler for creating a new todo list
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Authorization token missing or malformed in request header for POST /api/lists.');
      return NextResponse.json({ error: 'Authorization token required' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let decodedToken: { userId: number; email: string; } | null = null;

    try {
      decodedToken = jwt.verify(token, JWT_SECRET) as { userId: number; email: string; };
    } catch (jwtError) {
      console.error('JWT verification failed for POST /api/lists:', jwtError);
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    if (!decodedToken || typeof decodedToken.userId !== 'number') {
      console.error('Decoded token payload is invalid or missing userId for POST /api/lists:', decodedToken);
      return NextResponse.json({ error: 'Invalid token payload: userId missing' }, { status: 401 });
    }

    const userId = decodedToken.userId;
    const { title, description } = await request.json();

    const result = await createTodoList(userId, title, description);

    if (result.success) {
      return NextResponse.json({ message: 'To-Do list created successfully!', list: result.list }, { status: 201 });
    } else {
      let statusCode = 500;
      if (result.error === 'List title is required') {
        statusCode = 400;
      }
      console.error('Error from createTodoList action:', result.error);
      return NextResponse.json({ error: result.error }, { status: statusCode });
    }

  } catch (error) {
    console.error('Unexpected error in POST /api/lists route:', error);
    return NextResponse.json({ error: 'Internal server error processing request' }, { status: 500 });
  }
}


