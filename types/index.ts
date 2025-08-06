

// types.ts

export interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  dueDate: Date | null;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  userId: number;
  todoListId: number;
  createdAt: Date;
  updatedAt: Date;
  // Add the new derived status property
  status?: 'Completed' | 'Overdue' | 'Today' | 'Upcoming' | 'Pending';
  // Add the relation to TodoList for displaying its title
  todoList?: { // Make it optional in case it's not always included
    title: string;
  };
}

export interface TodoList {
  id: number;
  title: string;
  description: string | null;
  ownerId: number;
  // Add other properties if needed for TodoList
}
