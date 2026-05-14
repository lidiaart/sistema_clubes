'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Sidebar from './Sidebar';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <header className="bg-[#0B1F33] p-4 text-[#F7F7F7]">
          <div className="flex justify-between">
            <h1 className="text-[#E68A2E]">Sistema de Clubes</h1>
            {session ? (
              <span>Olá, {session.user.name}</span>
            ) : (
              <Link href="/login" className="text-[#E68A2E]">Login</Link>
            )}
          </div>
        </header>
      </div>
    </div>
  );
}