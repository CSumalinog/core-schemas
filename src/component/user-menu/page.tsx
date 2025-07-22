'use client';

import { useState } from 'react';
import { Settings, LogOut, UserCircle } from 'lucide-react';
import Link from 'next/link';

export default function UserMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 hover:bg-neutral-700 px-2 py-2 rounded w-full"
      >
        <UserCircle size={22} />{' '}
        <span className="hidden md:inline">Profile</span>
      </button>

      {open && (
        <div className="absolute left-full top-1/2 -translate-y-1/2  mt-2 bg-neutral-900 text-white rounded shadow-lg min-w-[250px] px-2 py-2">
          <Link
            href="/admin/settings"
            className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-700 w-full"
          >
            <Settings size={20} /> Settings
          </Link>
          <button
            onClick={() => alert('Logging out')}
            className="w-full flex items-center gap-2 px-4 py-2 hover:bg-neutral-700"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      )}
    </div>
  );
}
