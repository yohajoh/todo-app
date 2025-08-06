// lib/actions/list.ts

// CORRECTED IMPORT: This line should point to your PrismaClient singleton file.
// Assuming your singleton is at `your-project/prisma/client.ts`.
import prisma from '@/prisma/client';

/**
 * Creates a new To-Do list for a given user.
 * This function interacts directly with the database using Prisma.
 *
 * @param userId The ID of the user who owns this list (obtained from the authenticated JWT).
 * @param title The title of the To-Do list.
 * @param description Optional description for the list.
 * @returns An object indicating success or failure, with the new list data if successful.
 */
export async function createTodoList(userId: number, title: string, description: string | null | undefined) {
  try {
    // Basic validation: ensure the title is provided and not just whitespace.
    if (!title || title.trim() === '') {
      return { success: false, error: 'List title is required' };
    }

    // Create the new TodoList in the database.
    // This line should now work correctly because 'prisma' is the instantiated client.
    const newTodoList = await prisma.todoList.create({
      data: {
        title: title,
        description: description,
        ownerId: userId, // Link the list to its owner (the authenticated user).
        // Create an entry in the UserOnTodoList junction table.
        // This ensures the owner is automatically added as a member with ADMIN role.
        members: {
          create: {
            userId: userId,
            role: 'ADMIN', // The owner is automatically an ADMIN of their own list.
          },
        },
      },
      select: { // Select only the necessary fields to return to the frontend.
        id: true,
        title: true,
        description: true,
        ownerId: true,
      },
    });

    return { success: true, list: newTodoList };

  } catch (error) {
    // Log the full error for server-side debugging.
    console.error('Create List action error:', error);
    // Return a generic error message to the client for security and simplicity.
    return { success: false, error: 'Internal server error during list creation. Please try again later.' };
  }
}
