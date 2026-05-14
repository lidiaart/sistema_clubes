'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password) {
      alert('Por favor, preencha email e senha.');
      return;
    }

    setSubmitting(true);

    const result = await signIn('credentials', {
      redirect: false,
      email: email.trim(),
      password,
    });

    setSubmitting(false);

    if (result?.error) {
      alert('Credenciais inválidas');
      return;
    }

    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-4">Entrar</h1>
        <p className="text-sm text-slate-500 mb-6">Acesse sua conta para participar dos clubes.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-slate-900 focus:outline-none"
          />
          <label className="block text-sm font-medium text-slate-700">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-slate-900 focus:outline-none"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-white font-semibold hover:bg-slate-700 transition disabled:opacity-60"
          >
            {submitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className="mt-6 text-sm text-slate-500">
          Ainda não tem conta?{' '}
          <Link href="/register" className="text-slate-900 font-semibold hover:text-slate-700">
            Cadastre-se aqui
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
