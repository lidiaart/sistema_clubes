'use client';

import { useEffect, useState } from 'react';

interface UserData {
  id: number;
  name: string;
  email: string;
  profile_picture_url?: string | null;
  is_admin: boolean;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => {
        if (!res.ok) throw new Error('Não autorizado');
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setName(data.name || '');
        setEmail(data.email || '');
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !email.trim()) {
      alert('Nome e email são obrigatórios.');
      return;
    }

    setSubmitting(true);

    const response = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        password: password || undefined,
      }),
    });

    setSubmitting(false);

    if (response.ok) {
      const updatedUser = await response.json();
      setUser(updatedUser);
      setPassword('');
      alert('Perfil atualizado com sucesso.');
    } else {
      const data = await response.json();
      alert(data.error || 'Falha ao atualizar perfil.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin h-12 w-12 rounded-full border-4 border-slate-300 border-t-slate-900"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md text-center bg-white border border-slate-200 rounded-3xl shadow-xl p-8">
          <h1 className="text-2xl font-semibold text-slate-900 mb-4">Acesso necessário</h1>
          <p className="text-slate-500">Você precisa entrar para ver e editar seu perfil.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-xl p-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-4">Meu Perfil</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-slate-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-slate-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Nova senha (opcional)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-slate-900 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-white font-semibold hover:bg-slate-700 transition disabled:opacity-60"
          >
            {submitting ? 'Atualizando...' : 'Salvar alterações'}
          </button>
        </form>
      </div>
    </div>
  );
}
