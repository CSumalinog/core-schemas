'use client';

import { useState } from 'react';
import UserMenu from '@/component/user-menu/page';
import Link from 'next/link';
import Header from '@/component/header/page';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  ClipboardCheck,
  Menu,
  X,
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Header />

      <div className="min-h-screen flex flex-col md:flex-row">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between bg-neutral-900 text-white p-4">
          <h2 className="hidden md:block text-xl font-bold mb-6">
            Admin Panel
          </h2>

          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={28} />
          </button>
        </header>

        {/* Sidebar Overlay (Mobile) */}
        <div
          className={`fixed inset-0 z-40 bg-neutral-900 bg-opacity-50 transition-opacity md:hidden ${
            sidebarOpen ? 'block' : 'hidden'
          }`}
          onClick={() => setSidebarOpen(false)}
        ></div>

        {/* Sidebar Drawer */}
        <aside
          className={`fixed z-50 inset-y-0 left-0 w-64 bg-neutral-900 text-white p-4 transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          {/* Close button (mobile) */}
          <div className="md:hidden flex justify-end mb-4">
            <button onClick={() => setSidebarOpen(false)}>
              <X size={24} />
            </button>
          </div>

          {/* Sidebar content */}
          <div className="flex flex-col justify-between h-full">
            <nav className="space-y-2">
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-2 hover:bg-neutral-700 rounded px-2 py-1"
              >
                <LayoutDashboard size={20} /> Dashboard
              </Link>
              <hr />
              <Link
                href="/admin/calendar"
                className="flex items-center gap-2 hover:bg-neutral-700 rounded px-2 py-1"
              >
                <CalendarDays size={20} /> Calendar
              </Link>
              <hr />
              <Link
                href="/admin/assignment"
                className="flex items-center gap-2 hover:bg-neutral-700 rounded px-2 py-1"
              >
                <ClipboardCheck size={20} /> Assignment
              </Link>
              <hr />
              <Link
                href="/admin/staffer"
                className="flex items-center gap-2 hover:bg-neutral-700 rounded px-2 py-1"
              >
                <Users size={20} /> Staffer
              </Link>
              <hr />
            </nav>

            <div className="flex justify-end mt-4 border-t pt-4">
              <UserMenu />
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 bg-gray-100 p-4 sm:p-6 mt-4 md:mt-0">
          {children}
        </main>
      </div>
    </>
  );
}
