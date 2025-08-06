"use client";

import React, { useState } from 'react';
import Link from "next/link";
import { useRouter, usePathname } from 'next/navigation';

// Shadcn UI components
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";

// Lucide React Icons
import {
  Home, ListTodo, Share2, CalendarDays, AlertCircle, PlusCircle, Settings, LogOut,
  ChevronRight, ArrowRight, Sun, Star, Flag, Clock, CheckSquare // Added CheckSquare for new task
} from "lucide-react";

interface AppSidebarProps {
  onLogout: () => void;
}

export function AppSidebar({ onLogout, ...props }: AppSidebarProps & React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const myLists = [
    { id: 1, title: "Work Projects" },
    { id: 2, title: "Personal Goals" },
    { id: 3, title: "Groceries" },
    { id: 4, title: "Home Renovation" },
    { id: 5, title: "Learning & Development" },
  ];

  const sharedLists = [
    { id: 101, title: "Team Sprint Q3", role: "Editor" },
    { id: 102, title: "Family Chores", role: "Viewer" },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsSheetOpen(false);
  };

  const isActive = (path: string) => pathname === path;

  const renderSidebarNavContent = () => (
    <nav className="flex flex-col space-y-2">
      {/* Quick Views */}
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mt-4 mb-2 px-2">
        Quick Views
      </h3>
      <Button
        variant={isActive('/dashboard') ? 'secondary' : 'ghost'}
        className="justify-start rounded-lg px-3 py-2 text-base"
        onClick={() => handleNavigation('/dashboard')}
      >
        <Home className="mr-2 h-5 w-5" /> All My Tasks
      </Button>
      <Button
        variant={isActive('/dashboard/today') ? 'secondary' : 'ghost'}
        className="justify-start rounded-lg px-3 py-2 text-base"
        onClick={() => handleNavigation('/dashboard/today')}
      >
        <CalendarDays className="mr-2 h-5 w-5" /> Today
      </Button>
      <Button
        variant={isActive('/dashboard/upcoming') ? 'secondary' : 'ghost'}
        className="justify-start rounded-lg px-3 py-2 text-base"
        onClick={() => handleNavigation('/dashboard/upcoming')}
      >
        <ArrowRight className="mr-2 h-5 w-5" /> Upcoming
      </Button>
      <Button
        variant={isActive('/dashboard/overdue') ? 'secondary' : 'ghost'}
        className="justify-start rounded-lg px-3 py-2 text-base"
        onClick={() => handleNavigation('/dashboard/overdue')}
      >
        <AlertCircle className="mr-2 h-5 w-5" /> Overdue
      </Button>

      <Separator className="my-4" />

      {/* Add New Task Button */}
      <Button
        variant="ghost"
        className="justify-start rounded-lg px-3 py-2 text-base text-green-600 hover:text-green-700 font-semibold"
        onClick={() => handleNavigation('/dashboard/todos/new')}
      >
        <CheckSquare className="mr-2 h-5 w-5" /> Add New Task
      </Button>

      <Separator className="my-4" />

      {/* My Lists */}
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
        My Lists
      </h3>
      {myLists.map((list) => (
        <Button
          key={list.id}
          variant={isActive(`/dashboard/lists/${list.id}`) ? 'secondary' : 'ghost'}
          className="justify-start rounded-lg px-3 py-2 text-base"
          onClick={() => handleNavigation(`/dashboard/lists/${list.id}`)}
        >
          <ChevronRight className="mr-2 h-4 w-4" /> {list.title}
        </Button>
      ))}
      <Button
        variant="ghost"
        className="justify-start rounded-lg px-3 py-2 text-base text-primary hover:text-primary/80"
        onClick={() => handleNavigation('/dashboard/lists/new')}
      >
        <PlusCircle className="mr-2 h-5 w-5" /> Create New List
      </Button>

      <Separator className="my-4" />

      {/* Shared Lists */}
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
        Shared Lists
      </h3>
      {sharedLists.map((list) => (
        <Button
          key={list.id}
          variant={isActive(`/dashboard/lists/${list.id}`) ? 'secondary' : 'ghost'}
          className="justify-start rounded-lg px-3 py-2 text-base"
          onClick={() => handleNavigation(`/dashboard/lists/${list.id}`)}
        >
          <Share2 className="mr-2 h-5 w-5" /> {list.title} ({list.role})
        </Button>
      ))}

      <Separator className="my-4" />

      {/* Filters */}
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
        Filters
      </h3>
      <Button
        variant={isActive('/dashboard/priority/urgent') ? 'secondary' : 'ghost'}
        className="justify-start rounded-lg px-3 py-2 text-base"
        onClick={() => handleNavigation('/dashboard/priority/urgent')}
      >
        <Flag className="mr-2 h-5 w-5 text-red-500" /> Urgent
      </Button>
      <Button
        variant={isActive('/dashboard/priority/high') ? 'secondary' : 'ghost'}
        className="justify-start rounded-lg px-3 py-2 text-base"
        onClick={() => handleNavigation('/dashboard/priority/high')}
      >
        <Star className="mr-2 h-5 w-5 text-yellow-500" /> High
      </Button>
      <Button
        variant={isActive('/dashboard/priority/medium') ? 'secondary' : 'ghost'}
        className="justify-start rounded-lg px-3 py-2 text-base"
        onClick={() => handleNavigation('/dashboard/priority/medium')}
      >
        <Sun className="mr-2 h-5 w-5 text-orange-500" /> Medium
      </Button>
      <Button
        variant={isActive('/dashboard/priority/low') ? 'secondary' : 'ghost'}
        className="justify-start rounded-lg px-3 py-2 text-base"
        onClick={() => handleNavigation('/dashboard/priority/low')}
      >
        <Clock className="mr-2 h-5 w-5 text-blue-500" /> Low
      </Button>

      <Separator className="my-4" />

      {/* Account Actions */}
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
        Account
      </h3>
      <Button
        variant={isActive('/dashboard/settings') ? 'secondary' : 'ghost'}
        className="justify-start rounded-lg px-3 py-2 text-base"
        onClick={() => handleNavigation('/dashboard/settings')}
      >
        <Settings className="mr-2 h-5 w-5" /> Settings
      </Button>
      <Button
        variant="ghost"
        className="justify-start rounded-lg px-3 py-2 text-base text-red-500 hover:text-red-600"
        onClick={onLogout}
      >
        <LogOut className="mr-2 h-5 w-5" /> Logout
      </Button>
    </nav>
  );

  return (
    <>
      {/* Mobile Sidebar Trigger (Hamburger Icon) - Remains outside Shadcn's <Sidebar> */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full shadow-lg">
              <ListTodo className="h-5 w-5" />
              <span className="sr-only">Open sidebar</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex flex-col h-full bg-background pt-8">
              <div className="px-4 mb-6">
                <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
                  <ListTodo className="h-6 w-6" /> My To-Dos
                </h1>
              </div>
              <ScrollArea className="flex-1 px-4 pb-4">
                {renderSidebarNavContent()}
              </ScrollArea>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar - Now uses Shadcn's <Sidebar> component */}
      <Sidebar collapsible="icon" {...props}>
        <SidebarContent className="flex-1 px-4 pb-4">
          <ScrollArea className="h-full">
            <h1 className="text-2xl font-bold text-primary flex items-center gap-2 mt-4">
              <ListTodo className="h-7 w-7" /> My To-Dos
            </h1>
            {renderSidebarNavContent()}
          </ScrollArea>
        </SidebarContent>
      </Sidebar>
    </>
  );
}
