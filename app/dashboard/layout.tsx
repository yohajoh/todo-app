"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Shadcn UI Sidebar Layout Components
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

import { AppSidebar } from '@/components/AppSidebar'; // Changed to named import for AppSidebar

interface DashboardLayoutProps {
  children: React.ReactNode; // This prop will contain the content of nested pages
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        // IMPORTANT: In a real app, you MUST validate this token with your backend.
        // For example, by sending it to a /api/auth/verify endpoint.
        // If validation fails, treat as unauthenticated.
        setIsAuthenticated(true);
      } else {
        // If no token is found, or token validation fails, redirect to login
        router.push('/');
      }
      setLoading(false);
    };
    checkAuthStatus();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Clear the token from local storage
    setIsAuthenticated(false); // Update authentication state
    router.push('/'); // Redirect back to the authentication page
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-700">Loading dashboard...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // If not authenticated, return null. The useEffect will have already triggered
    // the redirect to the '/' page. This prevents rendering protected content.
    return null;
  }

  return (
    <SidebarProvider>
      {/* AppSidebar will contain your actual sidebar navigation */}
      <AppSidebar onLogout={handleLogout} />

      <SidebarInset>
        {/* Header with Sidebar Trigger and Breadcrumbs */}
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" /> {/* This button will toggle the sidebar */}
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                {/* BreadcrumbPage will be dynamically set by each individual page */}
                <BreadcrumbItem>
                  <BreadcrumbPage>Tasks</BreadcrumbPage> {/* Default/Placeholder */}
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* Main Content Area - SidebarInset handles the margin automatically */}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="container mx-auto">
            {children} {/* This is where the content of your nested dashboard pages will be rendered */}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
