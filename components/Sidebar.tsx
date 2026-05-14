'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Sidebar() {
  const { data: session } = useSession();

  return (
    <div className="w-64 bg-[#132E4A] h-full p-4">
      <nav>
        <Link href="/dashboard" className="block text-[#F7F7F7] mb-2">Dashboard</Link>
        <Link href="/clubes" className="block text-[#F7F7F7] mb-2">Clubes</Link>
        {session && <button onClick={() => signOut()} className="text-[#E68A2E]">Logout</button>}
      </nav>
    </div>
  );
}