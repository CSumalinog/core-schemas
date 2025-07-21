'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function Login() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    handleRoleRedirect(data.user?.id);
  };

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      setErrorMessage('Google sign-in failed');
    }
    // Redirect happens automatically via Supabase, but you can also set a callback URL.
  };

  const handleRoleRedirect = async (userId: string | undefined) => {
    if (!userId) {
      setErrorMessage('No user ID found');
      return;
    }

    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('role')
      .eq('id', userId)
      .single();

    if (roleError || !roleData?.role) {
      setErrorMessage('Failed to fetch user role');
      return;
    }

    switch (roleData.role) {
      case 'admin':
        router.push('/admin/dashboard');
        break;
      case 'staffer':
        router.push('/staffer/panel');
        break;
      case 'client':
        router.push('/client/home');
        break;
      default:
        setErrorMessage('Unknown role');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {errorMessage && (
          <p className="text-red-500 mb-4 text-sm text-center">
            {errorMessage}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1 font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-3 py-2 border rounded border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block mb-1 font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="w-full px-3 py-2 border rounded border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
          >
            Login
          </button>
        </form>

        <div className="my-4 text-center text-sm text-gray-500">OR</div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200"
        >
          Sign in with Google
        </button>

      
      </div>
    </div>
  );
}
