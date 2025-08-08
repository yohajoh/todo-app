
// app/api/todos/[id]/route.ts

import { NextResponse, NextRequest } from 'next/server'; // Import NextRequest
import jwt from 'jsonwebtoken';
import { updateTodo, deleteTodo } from '@/lib/actions/todo'; // Import update and delete actions

// IMPORTANT: This must match the JWT_SECRET in your .env.local file
// and in your sign-in route (app/api/auth/signin/route.ts).
const JWT_SECRET = process.env.JWT_SECRET || 'f70c6707c5a26b5650b3da2df3d69bfe7e8cd9d13ec6913bdf951b503638ef5b';

/**
 * PUT handler for updating a specific todo item.
 * This function receives updated task data and calls the backend action to modify the task in the database.
 * It performs JWT verification for authentication and authorization.
 */
export async function PUT(
  request: NextRequest, // First argument is the NextRequest object
  context: { params: Promise<{ id: string }> } // Second argument is the context object, containing params
) {
  try {
    // Destructure 'id' directly from context.params to satisfy the linter/compiler
    const { id } = await context.params;
    const todoId = parseInt(id); // Use the destructured id
    if (isNaN(todoId)) {
      return NextResponse.json({ error: 'Invalid Todo ID' }, { status: 400 });
    }

    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Authorization token missing or malformed for PUT /api/todos/[id].');
      return NextResponse.json({ error: 'Authorization token required' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let decodedToken: { userId: number; email: string; } | null = null;

    // Verify the JWT to get the user ID for authorization
    try {
      decodedToken = jwt.verify(token, JWT_SECRET) as { userId: number; email: string; };
    } catch (jwtError) {
      console.error('JWT verification failed for PUT /api/todos/[id]:', jwtError);
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    if (!decodedToken || typeof decodedToken.userId !== 'number') {
      console.error('Decoded token payload is invalid or missing userId for PUT /api/todos/[id].');
      return NextResponse.json({ error: 'Invalid token payload: userId missing' }, { status: 401 });
    }

    const userId = decodedToken.userId; // Get the user ID from the verified token
    const { title, description, completed, dueDate, priority, todoListId } = await request.json(); // Get updated data from request body

    // Prepare the data object for the updateTodo action.
    // Only include fields that are actually present in the request body to allow partial updates.
    const updateData: {
      title?: string;
      description?: string | null;
      completed?: boolean;
      dueDate?: Date | null;
      priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
      todoListId?: number;
    } = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (completed !== undefined) updateData.completed = completed;
    if (priority !== undefined) updateData.priority = priority;
    if (todoListId !== undefined) updateData.todoListId = parseInt(todoListId); // Ensure todoListId is a number

    // Handle dueDate: it can be a string, null, or undefined.
    // Convert string dates to Date objects, or set to null if explicitly null.
    if (dueDate !== undefined) {
      if (dueDate === null) {
        updateData.dueDate = null; // Explicitly set to null if received as null
      } else {
        try {
          const parsedDate = new Date(dueDate);
          if (!isNaN(parsedDate.getTime())) { // Check if date parsing was successful
            updateData.dueDate = parsedDate;
          } else {
            console.warn('Invalid dueDate string received for update:', dueDate);
            // You might choose to throw an error here, or ignore the invalid date
          }
        } catch (e) {
          console.warn('Error parsing dueDate for update:', e);
          // Handle parsing errors, e.g., if dueDate is not a valid date string
        }
      }
    }

    // Call the updateTodo action to perform the database update
    const result = await updateTodo(todoId, userId, updateData);

    if (result.success) {
      return NextResponse.json({ message: 'Todo updated successfully!', todo: result.todo }, { status: 200 });
    } else {
      // Handle specific errors returned by the updateTodo action
      let statusCode = 500;
      if (result.error === 'Todo not found or unauthorized') {
        statusCode = 404; // Not Found or Forbidden
      } else if (result.error === 'Invalid or unauthorized new Todo List ID') {
        statusCode = 403; // Forbidden
      } else if (result.error === 'Invalid Todo ID' || result.error === 'Todo title is required') {
        statusCode = 400; // Bad Request
      }
      console.error('Error from updateTodo action:', result.error);
      return NextResponse.json({ error: result.error || 'Failed to update todo item.' }, { status: statusCode });
    }

  } catch (error) {
    console.error('Unexpected error in PUT /api/todos/[id] route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE handler for deleting a specific todo item.
 * This function handles requests to remove a task from the database.
 * It performs JWT verification for authentication and authorization.
 */
export async function DELETE(
  request: NextRequest, // First argument is the NextRequest object
  context: { params: Promise<{ id: string }> } // Second argument is the context object, containing params
) {
  try {
    // Destructure 'id' directly from context.params to satisfy the linter/compiler
    const { id } = await context.params;
    const todoId = parseInt(id); // Use the destructured id
    if (isNaN(todoId)) {
      return NextResponse.json({ error: 'Invalid Todo ID' }, { status: 400 });
    }

    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Authorization token missing or malformed for DELETE /api/todos/[id].');
      return NextResponse.json({ error: 'Authorization token required' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let decodedToken: { userId: number; email: string; } | null = null;

    // Verify the JWT to get the user ID for authorization
    try {
      decodedToken = jwt.verify(token, JWT_SECRET) as { userId: number; email: string; };
    } catch (jwtError) {
      console.error('JWT verification failed for DELETE /api/todos/[id]:', jwtError);
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    if (!decodedToken || typeof decodedToken.userId !== 'number') {
      console.error('Decoded token payload is invalid or missing userId for DELETE /api/todos/[id].');
      return NextResponse.json({ error: 'Invalid token payload: userId missing' }, { status: 401 });
    }

    const userId = decodedToken.userId; // Get the user ID from the verified token

    // Call the deleteTodo action to perform the database deletion
    const result = await deleteTodo(todoId, userId);

    if (result.success) {
      return NextResponse.json({ message: 'Todo deleted successfully!' }, { status: 200 });
    } else {
      // Handle specific errors returned by the deleteTodo action
      let statusCode = 500;
      if (result.error === 'Todo not found or unauthorized') {
        statusCode = 404; // Not Found or Forbidden
      }
      console.error('Error from deleteTodo action:', result.error);
      return NextResponse.json({ error: result.error || 'Failed to delete todo item.' }, { status: statusCode });
    }

  } catch (error) {
    console.error('Unexpected error in DELETE /api/todos/[id] route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
