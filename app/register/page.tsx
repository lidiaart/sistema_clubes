'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      alert('Por favor, preencha nome, email e senha.');
      return;
    }

    setSubmitting(true);

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        password,
        profile_picture_url: profilePictureUrl.trim() || null,
      }),
    });

    setSubmitting(false);

    if (response.ok) {
      router.push('/login');
    } else {
      const data = await response.json();
      alert(data.error || 'Falha ao cadastrar');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-4">Criar Conta</h1>
        <p className="text-sm text-slate-500 mb-6">Cadastre-se para gerenciar clubes, eventos e sua conta.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">Nome completo</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-slate-900 focus:outline-none"
          />
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
          <label className="block text-sm font-medium text-slate-700">URL da foto de perfil (opcional)</label>
          <input
            type="url"
            value={profilePictureUrl}
            onChange={(e) => setProfilePictureUrl(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-slate-900 focus:outline-none"
            placeholder="https://..."
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-white font-semibold hover:bg-slate-700 transition disabled:opacity-60"
          >
            {submitting ? 'Criando conta...' : 'Cadastrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
