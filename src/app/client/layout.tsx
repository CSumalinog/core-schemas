'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MdOutlineDashboard,
  MdOutlineAssignmentTurnedIn,
  MdLogout,
} from 'react-icons/md';
import { LuCalendarDays } from 'react-icons/lu';
import { FaUsers, FaBars } from 'react-icons/fa';
import { BiDockLeft, BiDockRight } from 'react-icons/bi';
import { IoSettingsOutline } from 'react-icons/io5';
import { FaRegCircleUser } from 'react-icons/fa6';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
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

      {/* Sidebar */}
      <aside
        className={`fixed z-50 inset-y-0 left-0 bg-neutral-900 text-white p-4 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:static md:translate-x-0 
          ${collapsed ? 'w-20' : 'w-64'} 
          flex flex-col justify-between`}
        style={{ backdropFilter: 'blur(4px)' }}
      >
        {/* Logo + Collapse Toggle */}
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

        {/* Navigation */}
        <nav className="space-y-2 flex-1">
          <SidebarLink
            href="/client/calendar"
            icon={<LuCalendarDays size={22} />}
            label="Calendar"
            collapsed={collapsed}
            onClick={() => setSidebarOpen(false)}
          />
          <SidebarLink
            href="/client/request"
            icon={<MdOutlineAssignmentTurnedIn size={22} />}
            label="My Requests"
            collapsed={collapsed}
            onClick={() => setSidebarOpen(false)}
          />
          
        </nav>

        {/* Account Menu */}
        <div className="mt-6 border-t pt-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 hover:bg-neutral-700 rounded px-2 py-2 w-full text-left">
                <FaRegCircleUser size={22} />
                {!collapsed && <span>Account</span>}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-58 bg-neutral-800 text-white">
              <DropdownMenuItem
                onClick={() => router.push('/admin/settings')}
                className="flex items-center gap-2"
              >
                <IoSettingsOutline size={22} className="text-white" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  console.log('Logging out...');
                  router.push('/login');
                }}
                className="flex items-center gap-2"
              >
                <MdLogout size={22} className="text-white" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className="flex-1 bg-neutral-100 p-4 sm:p-6 mt-4 md:mt-0 transition-all duration-300 ease-in-out"
        onClick={() => setSidebarOpen(false)}
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
      className="flex items-center gap-3 hover:bg-neutral-700 rounded px-3 py-3"
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </Link>
  );
}
