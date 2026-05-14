'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface UserData {
  id: number;
  name: string;
  email: string;
  profile_picture_url?: string | null;
  is_admin: boolean;
}

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Não autenticado');
        }
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/login');
  };

  return (
    <header className="bg-white/95 backdrop-blur sticky top-0 z-40 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3 py-4">
        <Link href="/" className="font-semibold text-xl text-slate-900 hover:text-slate-700">
          Gestão de Clubes
        </Link>
        <nav className="flex flex-wrap items-center gap-3">
          <Link href="/clubes" className="text-slate-600 hover:text-slate-900">
            Clubes
          </Link>
          {!loading && !user && (
            <>
              <Link href="/login" className="text-slate-600 hover:text-slate-900">
                Entrar
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-slate-900 px-4 py-2 text-white hover:bg-slate-700 transition"
              >
                Cadastrar
              </Link>
            </>
          )}
          {!loading && user && (
            <>
              <Link href="/profile" className="text-slate-600 hover:text-slate-900">
                Olá, {user.name.split(' ')[0]}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full bg-rose-500 px-4 py-2 text-white hover:bg-rose-600 transition"
              >
                Sair
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
