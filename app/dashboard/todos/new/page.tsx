"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Shadcn UI components
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // For dropdown
import { format } from 'date-fns'; // For formatting date input value

import { TodoList as TodoListType } from '@/types'; // Import TodoList interface

export default function NewTodoPage() {
  const router = useRouter();
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>(''); // Storing as string for input type="date"
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
  const [selectedTodoListId, setSelectedTodoListId] = useState<string>(''); // Storing as string for select value
  const [userTodoLists, setUserTodoLists] = useState<TodoListType[]>([]);
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [listsLoading, setListsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserLists = async () => {
      setListsLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/'); // Redirect if not authenticated
        return;
      }

      try {
        const response = await fetch('/api/lists', { // Assuming you'll add a GET handler for /api/lists
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (response.ok) {
          setUserTodoLists(data.lists || []); // Assuming API returns { lists: [...] }
          if (data.lists && data.lists.length > 0) {
            setSelectedTodoListId(String(data.lists[0].id)); // Auto-select first list
          }
        } else {
          setMessage(data.error || 'Failed to load your lists.');
        }
      } catch (error) {
        console.error('Error fetching user lists:', error);
        setMessage('Network error loading lists.');
      } finally {
        setListsLoading(false);
      }
    };

    fetchUserLists();
  }, [router]);

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    const token = localStorage.getItem('authToken');
    if (!token) {
      setMessage('Authentication required. Redirecting to login...');
      router.push('/');
      setIsLoading(false);
      return;
    }

    if (!selectedTodoListId) {
      setMessage('Please select a To-Do list.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          todoListId: parseInt(selectedTodoListId),
          title,
          description,
          dueDate: dueDate ? new Date(dueDate).toISOString() : null, // Convert to ISO string for backend
          priority,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Todo item created successfully!');
        // Clear form fields
        setTitle('');
        setDescription('');
        setDueDate('');
        setPriority('MEDIUM');
        // Optionally, redirect to the dashboard or the list page
        router.push(`/dashboard`); // Or `/dashboard/lists/${selectedTodoListId}`
      } else {
        console.error('Failed to create todo:', data.error);
        setMessage(data.error || 'Failed to create todo item. Please try again.');
      }
    } catch (error) {
      console.error('Network error during todo creation:', error);
      setMessage('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (listsLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-lg text-gray-700">Loading lists...</p>
      </div>
    );
  }

  if (userTodoLists.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 flex-col text-gray-700">
        <p className="text-lg mb-4">You don't have any To-Do lists yet!</p>
        <Button onClick={() => router.push('/dashboard/lists/new')}>Create Your First List</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="container mx-auto max-w-md">
        <Card className="rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Create New To-Do Item</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateTodo} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="todo-list">Belongs to List</Label>
                <Select value={selectedTodoListId} onValueChange={setSelectedTodoListId}>
                  <SelectTrigger id="todo-list" className="rounded-lg">
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

              <div className="grid gap-2">
                <Label htmlFor="todo-title">Task Title</Label>
                <Input
                  id="todo-title"
                  type="text"
                  placeholder="e.g., Finish report, Buy groceries"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="rounded-lg"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="todo-description">Description (Optional)</Label>
                <Textarea
                  id="todo-description"
                  placeholder="Details about this task..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="rounded-lg"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="todo-dueDate">Due Date (Optional)</Label>
                <Input
                  id="todo-dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="rounded-lg"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="todo-priority">Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger id="todo-priority" className="rounded-lg">
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

              {message && (
                <div className={`mb-4 p-3 rounded-md text-sm ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {message}
                </div>
              )}
              <Button type="submit" className="w-full rounded-lg py-2 text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300" disabled={isLoading}>
                {isLoading ? 'Adding Task...' : 'Add Task'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
