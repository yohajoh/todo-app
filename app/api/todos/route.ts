// app/api/todos/route.ts

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getAllTodosForUser, createTodo } from '@/lib/actions/todo'; // Import both actions

// IMPORTANT: This must match the JWT_SECRET in your .env.local file
// and in your sign-in route (app/api/auth/signin/route.ts).
const JWT_SECRET = process.env.JWT_SECRET || 'f70c6707c5a26b5650b3da2df3d69bfe7e8cd9d13ec6913bdf951b503638ef5b';

// GET handler for fetching all todos for a user
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authorization token required' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let decodedToken: { userId: number; email: string; } | null = null;

    try {
      decodedToken = jwt.verify(token, JWT_SECRET) as { userId: number; email: string; };
    } catch (jwtError) {
      console.error('JWT verification failed for /api/todos GET:', jwtError);
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    if (!decodedToken || typeof decodedToken.userId !== 'number') {
      console.error('Decoded token payload is invalid or missing userId for /api/todos GET:', decodedToken);
      return NextResponse.json({ error: 'Invalid token payload: userId missing' }, { status: 401 });
    }

    const userId = decodedToken.userId;

    const result = await getAllTodosForUser(userId);

    if (result.success) {
      return NextResponse.json({ todos: result.todos }, { status: 200 });
    } else {
      console.error('Error from getAllTodosForUser action:', result.error);
      return NextResponse.json({ error: result.error || 'Failed to retrieve tasks.' }, { status: 500 });
    }

  } catch (error) {
    console.error('Unexpected error in /api/todos GET route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST handler for creating a new todo
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authorization token required' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let decodedToken: { userId: number; email: string; } | null = null;

    try {
      decodedToken = jwt.verify(token, JWT_SECRET) as { userId: number; email: string; };
    } catch (jwtError) {
      console.error('JWT verification failed for /api/todos POST:', jwtError);
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    if (!decodedToken || typeof decodedToken.userId !== 'number') {
      console.error('Decoded token payload is invalid or missing userId for /api/todos POST:', decodedToken);
      return NextResponse.json({ error: 'Invalid token payload: userId missing' }, { status: 401 });
    }

    const userId = decodedToken.userId;
    const { todoListId, title, description, dueDate, priority } = await request.json();

    // Validate incoming data types for dueDate and priority
    let parsedDueDate: Date | null = null;
    if (dueDate) {
      try {
        parsedDueDate = new Date(dueDate);
        // Basic validation for date validity
        if (isNaN(parsedDueDate.getTime())) {
          parsedDueDate = null; // Treat as null if invalid date string
        }
      } catch (e) {
        parsedDueDate = null; // If parsing fails, treat as null
      }
    }

    const validPriorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
    const parsedPriority = validPriorities.includes(priority) ? priority : 'MEDIUM'; // Default to MEDIUM

    // Call the action to create the todo item
    const result = await createTodo(
      userId,
      parseInt(todoListId), // Ensure todoListId is a number
      title,
      description,
      parsedDueDate,
      parsedPriority as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
    );

    if (result.success) {
      return NextResponse.json({ message: 'Todo item created successfully!', todo: result.todo }, { status: 201 });
    } else {
      let statusCode = 500;
      if (result.error === 'Todo title is required' || result.error === 'Todo list is required') {
        statusCode = 400;
      } else if (result.error === 'Invalid or unauthorized Todo List ID') {
        statusCode = 403; // Forbidden
      }
      console.error('Error from createTodo action:', result.error);
      return NextResponse.json({ error: result.error || 'Failed to create todo item.' }, { status: statusCode });
    }

  } catch (error) {
    console.error('Unexpected error in /api/todos POST route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
