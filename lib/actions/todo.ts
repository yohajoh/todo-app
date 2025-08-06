
// lib/actions/todo.ts

import prisma from '@/prisma/client'; // Or '@/lib/prisma' if that's your setup
import { Todo } from '@/types'; // Import your Todo interface

/**
 * Fetches all To-Do items for a specific user.
 * @param userId The ID of the authenticated user.
 * @returns An object indicating success or failure, with an array of Todo items if successful.
 */
export async function getAllTodosForUser(userId: number): Promise<{ success: boolean; todos?: Todo[]; error?: string }> {
  try {
    const todos = await prisma.todo.findMany({
      where: {
        userId: userId, // Filter todos by the authenticated user's ID
      },
      orderBy: {
        createdAt: 'desc', // Order by creation date, newest first
      },
      // IMPORTANT: Include the related TodoList to get its title
      include: {
        todoList: {
          select: {
            title: true, // Only select the title of the related todo list
          },
        },
      },
    });

    const formattedTodos: Todo[] = todos.map(todo => ({
      ...todo,
      dueDate: todo.dueDate ? new Date(todo.dueDate) : null,
      createdAt: new Date(todo.createdAt),
      updatedAt: new Date(todo.updatedAt),
      // The 'todoList' property will now be included by Prisma
    }));

    return { success: true, todos: formattedTodos };
  } catch (error) {
    console.error('Error fetching all todos for user:', error);
    return { success: false, error: 'Failed to fetch todos from the database.' };
  }
}

/**
 * Creates a new To-Do item and links it to a user and a To-Do list.
 * @param userId The ID of the user who owns this todo item.
 * @param todoListId The ID of the TodoList this item belongs to.
 * @param title The title of the todo item.
 * @param description Optional description for the todo item.
 * @param dueDate Optional due date for the todo item.
 * @param priority Priority level of the todo item.
 * @returns An object indicating success or failure, with the new Todo item if successful.
 */
export async function createTodo(
  userId: number,
  todoListId: number,
  title: string,
  description: string | null | undefined,
  dueDate: Date | null | undefined,
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
): Promise<{ success: boolean; todo?: Todo; error?: string }> {
  try {
    if (!title || title.trim() === '') {
      return { success: false, error: 'Todo title is required' };
    }
    if (!todoListId) {
        return { success: false, error: 'Todo list is required' };
    }

    const todoList = await prisma.todoList.findUnique({
      where: { id: todoListId },
      select: { ownerId: true }
    });

    if (!todoList || todoList.ownerId !== userId) {
      return { success: false, error: 'Invalid or unauthorized Todo List ID' };
    }

    const newTodo = await prisma.todo.create({
      data: {
        title: title,
        description: description,
        dueDate: dueDate,
        priority: priority,
        userId: userId,
        todoListId: todoListId,
        completed: false,
      },
    });

    return { success: true, todo: newTodo };
  } catch (error) {
    console.error('Error creating todo:', error);
    return { success: false, error: 'Failed to create todo item.' };
  }
}


/**
 * Updates an existing To-Do item.
 * @param todoId The ID of the todo item to update.
 * @param userId The ID of the user performing the update (for authorization).
 * @param data The fields to update (partial Todo object).
 * @returns An object indicating success or failure, with the updated Todo item if successful.
 */
export async function updateTodo(
  todoId: number,
  userId: number,
  data: {
    title?: string;
    description?: string | null;
    completed?: boolean;
    dueDate?: Date | null;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    todoListId?: number;
  }
): Promise<{ success: boolean; todo?: Todo; error?: string }> {
  try {
    // First, verify that the todo exists and belongs to the user
    const existingTodo = await prisma.todo.findUnique({
      where: { id: todoId },
      select: { userId: true, todoListId: true }
    });

    if (!existingTodo || existingTodo.userId !== userId) {
      return { success: false, error: 'Todo not found or unauthorized' };
    }

    // If todoListId is being updated, verify the new todoListId belongs to the user
    if (data.todoListId && data.todoListId !== existingTodo.todoListId) {
      const newTodoList = await prisma.todoList.findUnique({
        where: { id: data.todoListId },
        select: { ownerId: true }
      });
      if (!newTodoList || newTodoList.ownerId !== userId) {
        return { success: false, error: 'Invalid or unauthorized new Todo List ID' };
      }
    }

    const updatedTodo = await prisma.todo.update({
      where: { id: todoId },
      data: {
        ...data,
        // Ensure dueDate is handled correctly if it's explicitly set to null
        dueDate: data.dueDate === null ? null : data.dueDate,
      },
      include: { // Include todoList title after update for consistent return type
        todoList: {
          select: {
            title: true,
          },
        },
      },
    });

    // Format dates for consistency with getAllTodosForUser
    const formattedTodo: Todo = {
      ...updatedTodo,
      dueDate: updatedTodo.dueDate ? new Date(updatedTodo.dueDate) : null,
      createdAt: new Date(updatedTodo.createdAt),
      updatedAt: new Date(updatedTodo.updatedAt),
    };

    return { success: true, todo: formattedTodo };
  } catch (error) {
    console.error('Error updating todo:', error);
    return { success: false, error: 'Failed to update todo item.' };
  }
}


/**
 * Deletes a To-Do item.
 * @param todoId The ID of the todo item to delete.
 * @param userId The ID of the user performing the delete (for authorization).
 * @returns An object indicating success or failure.
 */
export async function deleteTodo(todoId: number, userId: number): Promise<{ success: boolean; error?: string }> {
  try {
    // First, verify that the todo exists and belongs to the user
    const existingTodo = await prisma.todo.findUnique({
      where: { id: todoId },
      select: { userId: true } // Only need to select the userId for authorization check
    });

    // If the todo doesn't exist or doesn't belong to the current user, return an error
    if (!existingTodo || existingTodo.userId !== userId) {
      return { success: false, error: 'Todo not found or unauthorized' };
    }

    // If authorized, proceed with deletion
    await prisma.todo.delete({
      where: { id: todoId },
    });

    return { success: true }; // Indicate successful deletion
  } catch (error) {
    console.error('Error deleting todo:', error);
    return { success: false, error: 'Failed to delete todo item.' };
  }
}
