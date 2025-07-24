'use client';

import { useState } from 'react';
import UserMenu from '@/component/user-menu/page';
import Link from 'next/link';
import Header from '@/component/header/page';

import {
  MdOutlineDashboard,
  MdOutlineAssignmentTurnedIn,
} from 'react-icons/md';
import { LuCalendarDays } from 'react-icons/lu';
import { FaUsers, FaBars } from 'react-icons/fa';
import { BiDockLeft, BiDockRight } from 'react-icons/bi';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between bg-neutral-900 text-white p-4">
        <button onClick={() => setSidebarOpen(true)}>
          <FaBars size={24} />
        </button>
      </header>

      {/* Sidebar Drawer */}
      <aside
        className={`
          fixed z-50 inset-y-0 left-0 bg-neutral-900 text-white p-4
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:static md:translate-x-0 
          ${collapsed ? 'w-20' : 'w-64'} 
          flex flex-col justify-between
        `}
        style={{ backdropFilter: 'blur(4px)' }}
      >
        {/* Mobile Close Button (Hidden) */}
        <div className="flex justify-end mb-4 ">
          {/* <button onClick={() => setSidebarOpen(false)}>
            <FaTimes size={22} />
          </button> */}
        </div>

        {/* Logo + Collapse Toggle (Desktop only) */}
        <div className="flex items-center justify-between mb-6 px-2">
          <div className="mt-2">
            <Header />
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-white hover:bg-neutral-700 rounded p-1 hidden md:block"
          >
            {collapsed ? <BiDockRight size={25} /> : <BiDockLeft size={25} />}
          </button>
        </div>
        <hr />
        <div className="flex flex-col h-full mt-4 ">
          {/* Navigation */}
          <nav className="space-y-2 flex-1 ">
            <SidebarLink
              href="/admin/dashboard"
              icon={<MdOutlineDashboard size={22} />}
              label="Dashboard"
              collapsed={collapsed}
              onClick={() => setSidebarOpen(false)}
            />
            <SidebarLink
              href="/admin/calendar"
              icon={<LuCalendarDays size={22} />}
              label="Calendar"
              collapsed={collapsed}
              onClick={() => setSidebarOpen(false)}
            />
            <SidebarLink
              href="/admin/assignment"
              icon={<MdOutlineAssignmentTurnedIn size={22} />}
              label="Assignment"
              collapsed={collapsed}
              onClick={() => setSidebarOpen(false)}
            />
            <SidebarLink
              href="/admin/staffer"
              icon={<FaUsers size={22} />}
              label="Staffer"
              collapsed={collapsed}
              onClick={() => setSidebarOpen(false)}
            />
          </nav>

          {/* User Menu at Bottom */}
          <div className="mt-6 border-t pt-4">
            <UserMenu collapsed={collapsed} />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 bg-gray-100 p-4 sm:p-6 mt-4 md:mt-0 transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'opacity-100' : 'opacity-100'
        }`}
        onClick={() => setSidebarOpen(false)} // tap anywhere closes sidebar
      >
        {children}
      </main>
    </div>
  );
}

function SidebarLink({
  href,
  icon,
  label,
  collapsed,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2 hover:bg-neutral-700 rounded px-2 py-2"
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </Link>
  );
}
