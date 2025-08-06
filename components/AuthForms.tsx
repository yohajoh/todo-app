// "use client"; // <--- Add this directive at the very top

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation'; // Import useRouter for navigation

// // Shadcn UI components - assuming these are correctly set up in your project
// import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";

// const AuthForms = () => {
//   const router = useRouter(); // Initialize useRouter
//   const [isSignIn, setIsSignIn] = useState(true);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [name, setName] = useState('');
//   const [message, setMessage] = useState(''); // State for displaying messages to the user
//   const [isAuthenticated, setIsAuthenticated] = useState(false); // Simulate authentication status

//   // In a real application, you'd check for a token in localStorage/cookies here
//   // to determine if the user is already authenticated on component mount.
//   useEffect(() => {
//     const checkAuthStatus = () => {
//       // Example: Check if a token exists in local storage
//       const token = localStorage.getItem('authToken');
//       if (token) {
//         setIsAuthenticated(true);
//         router.push('/dashboard'); // Redirect if already authenticated
//       }
//     };
//     checkAuthStatus();
//   }, [router]);

//   // Handle Sign-In form submission
//   const handleSignIn = async (e) => {
//     e.preventDefault();
//     setMessage(''); // Clear previous messages
//     console.log('Attempting sign-in with:', { email, password });

//     try {
//       // --- Authentication Logic Placeholder ---
//       // Replace with actual API call to your backend
//       const response = await fetch('/api/auth/signin', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//       });
//       const data = await response.json();

//       if (response.ok) {
//         console.log('Sign-in successful:', data);
//         setMessage('Sign-in successful! Redirecting to dashboard...');
//         // In a real app, store the token/session info (e.g., localStorage.setItem('authToken', data.token);)
//         setIsAuthenticated(true); // Update auth status
//         router.push('/dashboard'); // Redirect to dashboard
//       } else {
//         console.error('Sign-in failed:', data.error);
//         setMessage(data.error || 'Sign-in failed. Please check your credentials.');
//       }
//     } catch (error) {
//       console.error('Network error during sign-in:', error);
//       setMessage('Network error. Please try again.');
//     }
//   };

//   // Handle Sign-Up form submission
//   const handleSignUp = async (e) => {
//     e.preventDefault();
//     setMessage(''); // Clear previous messages
//     console.log('Attempting sign-up with:', { name, email, password });

//     try {
//       // --- Authentication Logic Placeholder ---
//       // Replace with actual API call to your backend
//       const response = await fetch('/api/auth/signup', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ name, email, password }),
//       });
//       const data = await response.json();

//       if (response.ok) {
//         console.log('Sign-up successful:', data);
//         setMessage('Sign-up successful! Please sign in.');
//         setIsSignIn(true); // Switch to sign-in form after successful signup
//       } else {
//         console.error('Sign-up failed:', data.error);
//         setMessage(data.error || 'Sign-up failed. Please try again.');
//       }
//     } catch (error) {
//       console.error('Network error during sign-up:', error);
//       setMessage('Network error. Please try again.');
//     }
//   };

//   // If authenticated, render a simple dashboard placeholder
//   if (isAuthenticated) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-6 font-sans">
//         <Card className="rounded-xl shadow-lg w-full max-w-md text-center p-8">
//           <CardTitle className="text-3xl font-bold text-gray-800 mb-4">
//             Welcome to Your Dashboard!
//           </CardTitle>
//           <CardDescription className="text-gray-600">
//             You are successfully authenticated. This is where your To-Do lists will appear.
//           </CardDescription>
//           <Button onClick={() => {
//             // Simulate logout
//             localStorage.removeItem('authToken');
//             setIsAuthenticated(false);
//             router.push('/'); // Redirect back to auth page
//           }} className="mt-6 rounded-lg py-2 px-6 text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300">
//             Logout
//           </Button>
//         </Card>
//       </div>
//     );
//   }

//   // Otherwise, render the authentication forms
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-6 font-sans">
//       <div className="w-full max-w-md">
//         <Card className="rounded-xl shadow-lg">
//           <CardHeader className="text-center">
//             <CardTitle className="text-3xl font-bold text-gray-800">
//               {isSignIn ? 'Welcome Back!' : 'Join Us!'}
//             </CardTitle>
//             <CardDescription className="text-gray-600">
//               {isSignIn ? 'Sign in to access your To-Do lists.' : 'Create an account to start organizing your tasks.'}
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             {message && (
//               <div className={`mb-4 p-3 rounded-md text-sm ${message.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
//                 {message}
//               </div>
//             )}
//             {isSignIn ? (
//               // Sign-in Form
//               <form onSubmit={handleSignIn} className="space-y-6">
//                 <div className="grid gap-2">
//                   <Label htmlFor="email-signin">Email</Label>
//                   <Input
//                     id="email-signin"
//                     type="email"
//                     placeholder="m@example.com"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                     className="rounded-lg"
//                   />
//                 </div>
//                 <div className="grid gap-2">
//                   <Label htmlFor="password-signin">Password</Label>
//                   <Input
//                     id="password-signin"
//                     type="password"
//                     placeholder="••••••••"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                     className="rounded-lg"
//                   />
//                 </div>
//                 <Button type="submit" className="w-full rounded-lg py-2 px-6 text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300">
//                   Sign In
//                 </Button>
//               </form>
//             ) : (
//               // Sign-up Form
//               <form onSubmit={handleSignUp} className="space-y-6">
//                 <div className="grid gap-2">
//                   <Label htmlFor="name-signup">Name (Optional)</Label>
//                   <Input
//                     id="name-signup"
//                     type="text"
//                     placeholder="John Doe"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     className="rounded-lg"
//                   />
//                 </div>
//                 <div className="grid gap-2">
//                   <Label htmlFor="email-signup">Email</Label>
//                   <Input
//                     id="email-signup"
//                     type="email"
//                     placeholder="m@example.com"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                     className="rounded-lg"
//                   />
//                 </div>
//                 <div className="grid gap-2">
//                   <Label htmlFor="password-signup">Password</Label>
//                   <Input
//                     id="password-signup"
//                     type="password"
//                     placeholder="••••••••"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                     className="rounded-lg"
//                   />
//                 </div>
//                 <Button type="submit" className="w-full rounded-lg py-2 px-6 text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300">
//                   Sign Up
//                 </Button>
//               </form>
//             )}
//           </CardContent>
//           <CardFooter className="flex justify-center pt-4">
//             <p className="text-sm text-gray-600">
//               {isSignIn ? "Don't have an account?" : "Already have an account?"}{' '}
//               <Button
//                 variant="link"
//                 onClick={() => setIsSignIn(!isSignIn)}
//                 className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
//               >
//                 {isSignIn ? 'Sign Up' : 'Sign In'}
//               </Button>
//             </p>
//           </CardFooter>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default AuthForms;











"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Shadcn UI components
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const AuthForms = () => {
  const router = useRouter();
  const [isSignIn, setIsSignIn] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // This state is primarily for conditional rendering within this component

  // Effect to check authentication status on component mount
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        // If a token exists, assume authenticated and redirect to dashboard.
        // The dashboard layout will perform a more robust server-side validation.
        setIsAuthenticated(true); // Update local state
        router.push('/dashboard'); // Redirect
      }
    };
    checkAuthStatus();
  }, [router]);

  // Handle Sign-In form submission
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages
    console.log('Attempting sign-in with:', { email, password });

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      // Define expected data structure for sign-in response
      const data: { error?: string; message?: string; token?: string; user?: { id: number; email: string; name?: string | null } } = await response.json();

      if (response.ok) {
        console.log('Sign-in successful:', data);
        setMessage('Sign-in successful! Redirecting to dashboard...');
        if (data.token) {
          localStorage.setItem('authToken', data.token); // <--- CRITICAL FIX: Store the token
          setIsAuthenticated(true); // Update state to reflect authentication
          router.push('/dashboard'); // Redirect to dashboard
        } else {
          setMessage('Sign-in successful, but no authentication token received.');
        }
      } else {
        console.error('Sign-in failed:', data.error);
        setMessage(data.error || 'Sign-in failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Network error during sign-in:', error);
      setMessage('Network error. Please try again.');
    }
  };

  // Handle Sign-Up form submission
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    console.log('Attempting sign-up with:', { name, email, password });

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      // Define expected data structure for sign-up response
      const data: { error?: string; message?: string; user?: { id: number; email: string; name?: string | null } } = await response.json();

      if (response.ok) {
        console.log('Sign-up successful:', data);
        setMessage('Sign-up successful! Please sign in.');
        setIsSignIn(true); // Switch to sign-in form after successful signup
      } else {
        console.error('Sign-up failed:', data.error);
        setMessage(data.error || 'Sign-up failed. Please try again.');
      }
    } catch (error) {
      console.error('Network error during sign-up:', error);
      setMessage('Network error. Please try again.');
    }
  };

  // If isAuthenticated is true (meaning a token was found or just stored),
  // this component renders a temporary dashboard placeholder.
  // The actual dashboard content is in app/dashboard/page.tsx, which this component redirects to.
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-6 font-sans">
        <Card className="rounded-xl shadow-lg w-full max-w-md text-center p-8">
          <CardTitle className="text-3xl font-bold text-gray-800 mb-4">
            Welcome to Your Dashboard!
          </CardTitle>
          <CardDescription className="text-gray-600">
            You are successfully authenticated. Redirecting...
          </CardDescription>
          {/* Logout button for testing, though primary logout is in DashboardLayout */}
          <Button onClick={() => {
            localStorage.removeItem('authToken');
            setIsAuthenticated(false);
            router.push('/');
          }} className="mt-6 rounded-lg py-2 px-6 text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300">
            Logout
          </Button>
        </Card>
      </div>
    );
  }

  // Otherwise, render the authentication forms
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md">
        <Card className="rounded-xl shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-800">
              {isSignIn ? 'Welcome Back!' : 'Join Us!'}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {isSignIn ? 'Sign in to access your To-Do lists.' : 'Create an account to start organizing your tasks.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {message && (
              <div className={`mb-4 p-3 rounded-md text-sm ${message.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message}
              </div>
            )}
            {isSignIn ? (
              <form onSubmit={handleSignIn} className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="email-signin">Email</Label>
                  <Input
                    id="email-signin"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="rounded-lg"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password-signin">Password</Label>
                  <Input
                    id="password-signin"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="rounded-lg"
                  />
                </div>
                <Button type="submit" className="w-full rounded-lg py-2 px-6 text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300">
                  Sign In
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSignUp} className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="name-signup">Name (Optional)</Label>
                  <Input
                    id="name-signup"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-lg"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email-signup">Email</Label>
                  <Input
                    id="email-signup"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="rounded-lg"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password-signup">Password</Label>
                  <Input
                    id="password-signup"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="rounded-lg"
                  />
                </div>
                <Button type="submit" className="w-full rounded-lg py-2 px-6 text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300">
                  Sign Up
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center pt-4">
            <p className="text-sm text-gray-600">
              {isSignIn ? "Don't have an account?" : "Already have an account?"}{' '}
              <Button
                variant="link"
                onClick={() => setIsSignIn(!isSignIn)}
                className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                {isSignIn ? 'Sign Up' : 'Sign In'}
              </Button>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AuthForms;
