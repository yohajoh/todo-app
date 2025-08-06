// app/page.tsx
"use client"; // This page needs to be a client component to render AuthForms

import AuthForms from '@/components/AuthForms'; // Import your authentication forms component

export default function HomePage() {
  return (
    // This component will handle displaying sign-in/sign-up and redirecting
    // after successful authentication.
    <AuthForms />
  );
}
