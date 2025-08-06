

// "use client";

// import React, { useState, useEffect } from 'react';
// import { isToday, isPast, isFuture } from 'date-fns';

// import TodoListTable from '@/components/TodoListTable';
// import { Todo } from '@/types';

// export default function AllMyTasksPage() {
//   const [loadingTasks, setLoadingTasks] = useState(true);
//   const [tasks, setTasks] = useState<Todo[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   // Placeholder for update/delete actions
//   const handleUpdateTask = (id: number) => {
//     console.log(`Update task with ID: ${id}`);
//     // In a real app, you'd navigate to an edit page or open a modal
//     // router.push(`/dashboard/todos/edit/${id}`);
//   };

//   const handleDeleteTask = async (id: number) => {
//     console.log(`Delete task with ID: ${id}`);
//     // In a real app, you'd show a confirmation dialog, then make an API call
//     // Example API call (you'd need to create /api/todos/[id] DELETE route):
//     /*
//     const token = localStorage.getItem('authToken');
//     if (!token) {
//       setError('Authentication token missing for delete action.');
//       return;
//     }
//     if (window.confirm('Are you sure you want to delete this task?')) {
//       try {
//         const response = await fetch(`/api/todos/${id}`, {
//           method: 'DELETE',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//         });
//         if (response.ok) {
//           setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
//           console.log('Task deleted successfully!');
//         } else {
//           const errorData = await response.json();
//           setError(errorData.error || 'Failed to delete task.');
//         }
//       } catch (err) {
//         console.error('Network error during delete:', err);
//         setError('Network error during task deletion.');
//       }
//     }
//     */
//   };


//   useEffect(() => {
//     const fetchTasksFromDb = async () => {
//       setLoadingTasks(true);
//       setError(null);

//       const token = localStorage.getItem('authToken');
//       if (!token) {
//         setError('Authentication token missing. Please log in.');
//         setLoadingTasks(false);
//         return;
//       }

//       try {
//         const response = await fetch('/api/todos', {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//         });

//         const data = await response.json();

//         if (response.ok) {
//           const processedTasks: Todo[] = (data.todos || []).map((todo: Todo) => {
//             let derivedStatus: 'Completed' | 'Overdue' | 'Today' | 'Upcoming' | 'Pending' = 'Pending';
//             const currentDueDate = todo.dueDate ? new Date(todo.dueDate) : null;

//             if (todo.completed) {
//               derivedStatus = 'Completed';
//             } else if (currentDueDate) {
//               if (isPast(currentDueDate) && !isToday(currentDueDate)) {
//                 derivedStatus = 'Overdue';
//               } else if (isToday(currentDueDate)) {
//                 derivedStatus = 'Today';
//               } else if (isFuture(currentDueDate)) {
//                 derivedStatus = 'Upcoming';
//               }
//             }

//             return {
//               ...todo,
//               status: derivedStatus,
//             };
//           });
//           setTasks(processedTasks);
//         } else {
//           console.error('Failed to fetch tasks:', data.error);
//           setError(data.error || 'Failed to load tasks from the server.');
//         }
//       } catch (err) {
//         console.error('Network error fetching tasks:', err);
//         setError('Network error. Could not connect to the server.');
//       } finally {
//         setLoadingTasks(false);
//       }
//     };

//     fetchTasksFromDb();
//   }, []);

//   if (loadingTasks) {
//     return (
//       <div className="flex items-center justify-center h-48">
//         <p className="text-lg text-gray-700">Loading tasks from database...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-48 text-red-600">
//         <p className="text-lg">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <TodoListTable
//       data={tasks}
//       title="All My Tasks"
//       onUpdate={handleUpdateTask} // Pass the update handler
//       onDelete={handleDeleteTask} // Pass the delete handler
//     />
//   );
// }



// "use client";

// import React, { useState, useEffect } from 'react';
// import { isToday, isPast, isFuture, format } from 'date-fns';
// import { useRouter } from 'next/navigation';

// import TodoListTable from '@/components/TodoListTable';
// import { Todo, TodoList as TodoListType } from '@/types';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Checkbox } from "@/components/ui/checkbox";

// export default function AllMyTasksPage() {
//   const router = useRouter();
//   const [loadingTasks, setLoadingTasks] = useState(true);
//   const [tasks, setTasks] = useState<Todo[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   // State for Update Dialog
//   const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
//   const [currentTodoToEdit, setCurrentTodoToEdit] = useState<Todo | null>(null);
//   const [editTitle, setEditTitle] = useState('');
//   const [editDescription, setEditDescription] = useState('');
//   const [editDueDate, setEditDueDate] = useState('');
//   const [editPriority, setEditPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
//   const [editCompleted, setEditCompleted] = useState(false);
//   const [editTodoListId, setEditTodoListId] = useState<string>('');
//   const [userTodoLists, setUserTodoLists] = useState<TodoListType[]>([]);
//   const [updateMessage, setUpdateMessage] = useState<string>('');
//   const [isUpdating, setIsUpdating] = useState<boolean>(false);

//   // Function to fetch tasks from the database
//   const fetchTasksFromDb = async () => {
//     setLoadingTasks(true);
//     setError(null);

//     const token = localStorage.getItem('authToken');
//     if (!token) {
//       setError('Authentication token missing. Please log in.');
//       setLoadingTasks(false);
//       router.push('/');
//       return;
//     }

//     try {
//       const response = await fetch('/api/todos', {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       if (response.status === 401) {
//         localStorage.removeItem('authToken');
//         router.push('/');
//         setError('Session expired. Please log in again.');
//         setLoadingTasks(false);
//         return;
//       }

//       const data = await response.json();

//       if (response.ok) {
//         const processedTasks: Todo[] = (data.todos || []).map((todo: Todo) => {
//           let derivedStatus: 'Completed' | 'Overdue' | 'Today' | 'Upcoming' | 'Pending' = 'Pending';
//           const currentDueDate = todo.dueDate ? new Date(todo.dueDate) : null;

//           if (todo.completed) {
//             derivedStatus = 'Completed';
//           } else if (currentDueDate) {
//             if (isPast(currentDueDate) && !isToday(currentDueDate)) {
//               derivedStatus = 'Overdue';
//             } else if (isToday(currentDueDate)) {
//               derivedStatus = 'Today';
//             } else if (isFuture(currentDueDate)) {
//               derivedStatus = 'Upcoming';
//             }
//           }

//           return {
//             ...todo,
//             status: derivedStatus,
//           };
//         });
//         setTasks(processedTasks);
//       } else {
//         console.error('Failed to fetch tasks:', data.error);
//         setError(data.error || 'Failed to load tasks from the server.');
//       }
//     } catch (err) {
//       console.error('Network error fetching tasks:', err);
//       setError('Network error. Could not connect to the server.');
//     } finally {
//       setLoadingTasks(false);
//     }
//   };

//   // Function to fetch user's todo lists for the dropdowns
//   const fetchUserLists = async () => {
//     const token = localStorage.getItem('authToken');
//     if (!token) return;

//     try {
//       const response = await fetch('/api/lists', {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       if (response.status === 401) {
//         localStorage.removeItem('authToken');
//         router.push('/');
//         setError('Session expired. Please log in again.');
//         return;
//       }

//       const data = await response.json();
//       if (response.ok) {
//         setUserTodoLists(data.lists || []);
//       } else {
//         console.error('Failed to load user lists for dropdown:', data.error);
//       }
//     } catch (error) {
//       console.error('Network error loading user lists:', error);
//     }
//   };


//   useEffect(() => {
//     fetchTasksFromDb();
//     fetchUserLists();
//   }, []);

//   // Handle Update Task (opens dialog)
//   const handleUpdateTask = (id: number) => {
//     const todoToEdit = tasks.find(task => task.id === id);
//     if (todoToEdit) {
//       setCurrentTodoToEdit(todoToEdit);
//       setEditTitle(todoToEdit.title);
//       setEditDescription(todoToEdit.description || '');
//       setEditDueDate(todoToEdit.dueDate ? format(new Date(todoToEdit.dueDate), 'yyyy-MM-dd') : '');
//       setEditPriority(todoToEdit.priority);
//       setEditCompleted(todoToEdit.completed);
//       setEditTodoListId(String(todoToEdit.todoListId));
//       setUpdateMessage('');
//       setIsUpdateDialogOpen(true);
//     }
//   };

//   // Handle Save Update (sends PUT request)
//   const handleSaveUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!currentTodoToEdit) return;

//     setIsUpdating(true);
//     setUpdateMessage('');

//     const token = localStorage.getItem('authToken');
//     if (!token) {
//       setUpdateMessage('Authentication token missing.');
//       setIsUpdating(false);
//       router.push('/');
//       return;
//     }

//     try {
//       const response = await fetch(`/api/todos/${currentTodoToEdit.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           title: editTitle,
//           description: editDescription,
//           completed: editCompleted,
//           dueDate: editDueDate ? new Date(editDueDate).toISOString() : null,
//           priority: editPriority,
//           todoListId: parseInt(editTodoListId),
//         }),
//       });

//       if (response.status === 401) {
//         localStorage.removeItem('authToken');
//         router.push('/');
//         setUpdateMessage('Session expired. Please log in again.');
//         setIsUpdating(false);
//         return;
//       }

//       const data = await response.json();

//       if (response.ok) {
//         setUpdateMessage('Task updated successfully!');
//         setIsUpdateDialogOpen(false);
//         fetchTasksFromDb(); // Re-fetch tasks to update the table
//       } else {
//         console.error('Failed to update task:', data.error);
//         setUpdateMessage(data.error || 'Failed to update task. Please try again.');
//       }
//     } catch (err) {
//       console.error('Network error during task update:', err);
//       setUpdateMessage('Network error. Could not update task.');
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   // Handle Delete Task (sends DELETE request)
//   const handleDeleteTask = async (id: number) => {
//     // Show a confirmation dialog before proceeding
//     if (!window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
//       return; // User cancelled the deletion
//     }

//     const token = localStorage.getItem('authToken');
//     if (!token) {
//       setError('Authentication token missing for delete action. Please log in.');
//       router.push('/');
//       return;
//     }

//     try {
//       const response = await fetch(`/api/todos/${id}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       // Check for 401 Unauthorized status (e.g., expired token)
//       if (response.status === 401) {
//         localStorage.removeItem('authToken'); // Clear the expired token
//         router.push('/'); // Redirect to login page
//         setError('Session expired. Please log in again.');
//         return;
//       }

//       if (response.ok) {
//         // If deletion is successful, update the local state to remove the task from the UI
//         setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
//         console.log('Task deleted successfully!');
//       } else {
//         // Handle API errors
//         const errorData = await response.json();
//         setError(errorData.error || 'Failed to delete task.');
//         console.error('Failed to delete task:', errorData.error);
//       }
//     } catch (err) {
//       // Handle network errors
//       console.error('Network error during delete:', err);
//       setError('Network error during task deletion. Please check your internet connection.');
//     }
//   };


//   if (loadingTasks) {
//     return (
//       <div className="flex items-center justify-center h-48">
//         <p className="text-lg text-gray-700">Loading tasks from database...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-48 text-red-600">
//         <p className="text-lg">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <>
//       <TodoListTable
//         data={tasks}
//         title="All My Tasks"
//         onUpdate={handleUpdateTask}
//         onDelete={handleDeleteTask}
//       />

//       {/* Shadcn UI Dialog for Update Task */}
//       <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
//         <DialogContent className="sm:max-w-[425px] rounded-xl shadow-lg">
//           <DialogHeader>
//             <DialogTitle>Edit Task</DialogTitle>
//             {/* <DialogDescription>
//               Make changes to your task here. Click save when you're done.
//             </DialogDescription> */}
//           </DialogHeader>
//           <form onSubmit={handleSaveUpdate} className="grid gap-4 py-4">
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="edit-title" className="text-right">
//                 Title
//               </Label>
//               <Input
//                 id="edit-title"
//                 value={editTitle}
//                 onChange={(e) => setEditTitle(e.target.value)}
//                 className="col-span-3 rounded-lg"
//                 required
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="edit-description" className="text-right">
//                 Description
//               </Label>
//               <Textarea
//                 id="edit-description"
//                 value={editDescription}
//                 onChange={(e) => setEditDescription(e.target.value)}
//                 className="col-span-3 rounded-lg"
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="edit-dueDate" className="text-right">
//                 Due Date
//               </Label>
//               <Input
//                 id="edit-dueDate"
//                 type="date"
//                 value={editDueDate}
//                 onChange={(e) => setEditDueDate(e.target.value)}
//                 className="col-span-3 rounded-lg"
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="edit-priority" className="text-right">
//                 Priority
//               </Label>
//               <Select value={editPriority} onValueChange={setEditPriority}>
//                 <SelectTrigger id="edit-priority" className="col-span-3 rounded-lg">
//                   <SelectValue placeholder="Select priority" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="URGENT">Urgent</SelectItem>
//                   <SelectItem value="HIGH">High</SelectItem>
//                   <SelectItem value="MEDIUM">Medium</SelectItem>
//                   <SelectItem value="LOW">Low</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="edit-todoList" className="text-right">
//                 List
//               </Label>
//               <Select value={editTodoListId} onValueChange={setEditTodoListId}>
//                 <SelectTrigger id="edit-todoList" className="col-span-3 rounded-lg">
//                   <SelectValue placeholder="Select a list" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {userTodoLists.map(list => (
//                     <SelectItem key={list.id} value={String(list.id)}>
//                       {list.title}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="flex items-center justify-end col-span-4 gap-2">
//               <Label htmlFor="edit-completed" className="text-right">
//                 Completed
//               </Label>
//               <Checkbox
//                 id="edit-completed"
//                 checked={editCompleted}
//                 onCheckedChange={(checked) => setEditCompleted(!!checked)}
//               />
//             </div>
//             {updateMessage && (
//               <div className={`col-span-4 text-center p-2 rounded-md text-sm ${updateMessage.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
//                 {updateMessage}
//               </div>
//             )}
//             <DialogFooter className="col-span-4 flex justify-end gap-2">
//               <Button type="button" variant="outline" onClick={() => setIsUpdateDialogOpen(false)} className="rounded-lg">
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={isUpdating} className="rounded-lg">
//                 {isUpdating ? 'Saving...' : 'Save changes'}
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }


"use client";

import React, { useState, useEffect } from 'react';
import { isToday, isPast, isFuture, format } from 'date-fns';
import { useRouter } from 'next/navigation';

import TodoListTable from '@/components/TodoListTable';
import { Todo, TodoList as TodoListType } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export default function AllMyTasksPage() {
  const router = useRouter();
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [tasks, setTasks] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);

  // State for Update Dialog
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [currentTodoToEdit, setCurrentTodoToEdit] = useState<Todo | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editPriority, setEditPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
  const [editCompleted, setEditCompleted] = useState(false);
  const [editTodoListId, setEditTodoListId] = useState<string>('');
  const [userTodoLists, setUserTodoLists] = useState<TodoListType[]>([]);
  const [updateMessage, setUpdateMessage] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Function to fetch tasks from the database
  const fetchTasksFromDb = async () => {
    setLoadingTasks(true);
    setError(null);

    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Authentication token missing. Please log in.');
      setLoadingTasks(false);
      router.push('/');
      return;
    }

    try {
      const response = await fetch('/api/todos', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('authToken');
        router.push('/');
        setError('Session expired. Please log in again.');
        setLoadingTasks(false);
        return;
      }

      const data = await response.json();

      if (response.ok) {
        const processedTasks: Todo[] = (data.todos || []).map((todo: Todo) => {
          let derivedStatus: 'Completed' | 'Overdue' | 'Today' | 'Upcoming' | 'Pending' = 'Pending';
          const currentDueDate = todo.dueDate ? new Date(todo.dueDate) : null;

          if (todo.completed) {
            derivedStatus = 'Completed';
          } else if (currentDueDate) {
            if (isPast(currentDueDate) && !isToday(currentDueDate)) {
              derivedStatus = 'Overdue';
            } else if (isToday(currentDueDate)) {
              derivedStatus = 'Today';
            } else if (isFuture(currentDueDate)) {
              derivedStatus = 'Upcoming';
            }
          }

          return {
            ...todo,
            status: derivedStatus,
          };
        });
        setTasks(processedTasks);
      } else {
        console.error('Failed to fetch tasks:', data.error);
        setError(data.error || 'Failed to load tasks from the server.');
      }
    } catch (err) {
      console.error('Network error fetching tasks:', err);
      setError('Network error. Could not connect to the server.');
    } finally {
      setLoadingTasks(false);
    }
  };

  // Function to fetch user's todo lists for the dropdowns
  const fetchUserLists = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const response = await fetch('/api/lists', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('authToken');
        router.push('/');
        setError('Session expired. Please log in again.');
        return;
      }

      const data = await response.json();
      if (response.ok) {
        setUserTodoLists(data.lists || []);
      } else {
        console.error('Failed to load user lists for dropdown:', data.error);
      }
    } catch (error) {
      console.error('Network error loading user lists:', error);
    }
  };


  useEffect(() => {
    fetchTasksFromDb();
    fetchUserLists();
  }, []);

  // Handle Update Task (opens dialog)
  const handleUpdateTask = (id: number) => {
    const todoToEdit = tasks.find(task => task.id === id);
    if (todoToEdit) {
      setCurrentTodoToEdit(todoToEdit);
      setEditTitle(todoToEdit.title);
      setEditDescription(todoToEdit.description || '');
      setEditDueDate(todoToEdit.dueDate ? format(new Date(todoToEdit.dueDate), 'yyyy-MM-dd') : '');
      setEditPriority(todoToEdit.priority);
      setEditCompleted(todoToEdit.completed);
      setEditTodoListId(String(todoToEdit.todoListId));
      setUpdateMessage('');
      setIsUpdateDialogOpen(true);
    }
  };

  // Handle Save Update (sends PUT request)
  const handleSaveUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTodoToEdit) return;

    setIsUpdating(true);
    setUpdateMessage('');

    const token = localStorage.getItem('authToken');
    if (!token) {
      setUpdateMessage('Authentication token missing.');
      setIsUpdating(false);
      router.push('/');
      return;
    }

    try {
      const response = await fetch(`/api/todos/${currentTodoToEdit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          completed: editCompleted,
          dueDate: editDueDate ? new Date(editDueDate).toISOString() : null,
          priority: editPriority,
          todoListId: parseInt(editTodoListId),
        }),
      });

      if (response.status === 401) {
        localStorage.removeItem('authToken');
        router.push('/');
        setUpdateMessage('Session expired. Please log in again.');
        setIsUpdating(false);
        return;
      }

      const data = await response.json();

      if (response.ok) {
        setUpdateMessage('Task updated successfully!');
        setIsUpdateDialogOpen(false);
        fetchTasksFromDb(); // Re-fetch tasks to update the table
      } else {
        console.error('Failed to update task:', data.error);
        setUpdateMessage(data.error || 'Failed to update task. Please try again.');
      }
    } catch (err) {
      console.error('Network error during task update:', err);
      setUpdateMessage('Network error. Could not update task.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle Delete Task (sends DELETE request)
  const handleDeleteTask = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Authentication token missing for delete action.');
      router.push('/');
      return;
    }

    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('authToken');
        router.push('/');
        setError('Session expired. Please log in again.');
        return;
      }

      if (response.ok) {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
        console.log('Task deleted successfully!');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to delete task.');
        console.error('Failed to delete task:', errorData.error);
      }
    } catch (err) {
      console.error('Network error during delete:', err);
      setError('Network error during task deletion.');
    }
  };


  if (loadingTasks) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-lg text-gray-700">Loading tasks from database...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-48 text-red-600">
        <p className="text-lg">{error}</p>
      </div>
    );
  }

  return (
    <>
      <TodoListTable
        data={tasks}
        title="All My Tasks"
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
      />

      {/* Shadcn UI Dialog for Update Task */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-xl shadow-lg">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Make changes to your task here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {/* Form with vertical grid layout */}
          <form onSubmit={handleSaveUpdate} className="grid gap-4 py-4">
            {/* Each input group now takes full width */}
            <div className="space-y-2"> {/* Added space-y for vertical spacing within the group */}
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full rounded-lg" // Ensure input takes full width
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-dueDate">Due Date</Label>
              <Input
                id="edit-dueDate"
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                className="w-full rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-priority">Priority</Label>
              <Select value={editPriority} onValueChange={setEditPriority}>
                <SelectTrigger id="edit-priority" className="w-full rounded-lg">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-todoList">List</Label>
              <Select value={editTodoListId} onValueChange={setEditTodoListId}>
                <SelectTrigger id="edit-todoList" className="w-full rounded-lg">
                  <SelectValue placeholder="Select a list" />
                </SelectTrigger>
                <SelectContent>
                  {userTodoLists.map(list => (
                    <SelectItem key={list.id} value={String(list.id)}>
                      {list.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-start gap-2 pt-2"> {/* Adjusted for checkbox alignment */}
              <Checkbox
                id="edit-completed"
                checked={editCompleted}
                onCheckedChange={(checked) => setEditCompleted(!!checked)}
              />
              <Label htmlFor="edit-completed" className="!text-left"> {/* Removed text-right */}
                Completed
              </Label>
            </div>
            {updateMessage && (
              <div className={`col-span-full text-center p-2 rounded-md text-sm ${updateMessage.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {updateMessage}
              </div>
            )}
            <DialogFooter className="col-span-full flex justify-end gap-2 pt-4"> {/* Adjusted for full width */}
              <Button type="button" variant="outline" onClick={() => setIsUpdateDialogOpen(false)} className="rounded-lg">
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating} className="rounded-lg">
                {isUpdating ? 'Saving...' : 'Save changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
