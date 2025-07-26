'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MdLogout } from 'react-icons/md';
import { IoSettingsOutline } from 'react-icons/io5';
import { FaRegCircleUser } from 'react-icons/fa6';

export default function UserMenu({ collapsed }: { collapsed: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 hover:bg-neutral-700 px-2 py-2 rounded w-full"
      >
        <FaRegCircleUser size={22} />
        {!collapsed && <span>Profile</span>}
      </button>

      {!collapsed && open && (
        <div className="absolute bottom-full left-0 w-full bg-neutral-800 text-white rounded shadow-md px-3 py-2 mb-1 z-50">
          <Link
            href="/admin/settings"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-700 w-full"
          >
            <IoSettingsOutline size={22} /> Settings
          </Link>
          <button
            onClick={() => alert('Logging out')}
            className="w-full flex items-center gap-2 px-4 py-2 hover:bg-neutral-700"
          >
            <MdLogout size={22} /> Logout
          </button>
        </div>
      )}
    </div>
  );
}
