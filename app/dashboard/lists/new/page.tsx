"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { AppSidebar } from '@/components/AppSidebar'; // Your combined sidebar component
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Assuming you have shadcn/ui add textarea
import { Button } from "@/components/ui/button";

export default function NewListPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [listTitle, setListTitle] = useState('');
  const [listDescription, setListDescription] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        setIsAuthenticated(true);
      } else {
        router.push('/');
      }
      setLoading(false);
    };
    checkAuthStatus();
  }, [router]);

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages

    const token = localStorage.getItem('authToken');
    if (!token) {
      setMessage('You must be logged in to create a list.');
      router.push('/'); // Redirect to login if no token
      return;
    }

    try {
      console.log("yohannes");
      const response = await fetch('/api/lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Send the JWT
        },
        body: JSON.stringify({ title: listTitle, description: listDescription }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('List created successfully!');
        // Redirect to the newly created list's page or back to the main dashboard
        router.push(`/dashboard`); // Assuming API returns list.id
      } else {
        console.error('Failed to create list:', data.error);
        setMessage(data.error || 'Failed to create list. Please try again.');
      }
    } catch (error) {
      console.error('Network error during list creation:', error);
      setMessage('Network error. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-700">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="container w-100%">
            <Card className="rounded-xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Create New To-Do List</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateList} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="list-title">List Title</Label>
                    <Input
                      id="list-title"
                      type="text"
                      placeholder="e.g., Work Projects, Groceries"
                      value={listTitle}
                      onChange={(e) => setListTitle(e.target.value)}
                      required
                      className="rounded-lg"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="list-description">Description (Optional)</Label>
                    <Textarea
                      id="list-description"
                      placeholder="A brief description of this list..."
                      value={listDescription}
                      onChange={(e) => setListDescription(e.target.value)}
                      className="rounded-lg"
                    />
                  </div>
                  {message && (
                    <div className={`mb-4 p-3 rounded-md text-sm ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {message}
                    </div>
                  )}
                  <Button type="submit" className="w-full rounded-lg py-2 text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300">
                    Create List
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
  );
}
