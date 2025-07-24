'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { FcGoogle } from 'react-icons/fc';
import { MdOutlineLogin } from 'react-icons/md';
import Footer from '@/component/footer/page';

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
    <>
      <div className="min-h-screen flex flex-col md:flex-row bg-neutral-900 ">
        {/* Left Side (neutral background) */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center">
          {/* Optional: branding, logo, or illustration can go here */}
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="TGP Logo" className="h-16 w-auto" />
          </div>
          <h1 className="text-white text-4xl font-bold">Welcome Back</h1>
        </div>

        {/* Right Side (Login form) */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-neutral-700">
          <div className="w-full max-w-sm backdrop-blur-md rounded-xl shadow-xl p-6 border border-white/20 bg-neutral-100">
            <h2 className="text-1xl font-bold mb-6 text-center flex items-center justify-center gap-2">
              <MdOutlineLogin size={24} /> Login
            </h2>

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
                  className="w-full px-3 py-2 border rounded border-gray-400 focus:outline-none focus:ring focus:border-gray-500"
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
                  className="w-full px-3 py-2 border rounded border-gray-400 focus:outline-none focus:ring focus:border-gray-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-neutral-700 text-white py-2 px-4 rounded hover:bg-amber-200 transition duration-200"
              >
                Login
              </button>
            </form>

            <div className="flex items-center my-4">
              <hr className="flex-grow border-t border-gray-400" />
              <span className="mx-4 text-sm text-neutral-500">OR</span>
              <hr className="flex-grow border-t border-gray-400" />
            </div>

            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-2 bg-amber-300 text-white py-2 px-4 rounded hover:bg-neutral-500 transition duration-200"
            >
              <FcGoogle className="w-5 h-5" />
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
