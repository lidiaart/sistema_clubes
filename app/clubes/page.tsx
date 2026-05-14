'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Club {
  id: number;
  name: string;
  category: string;
  description: string;
  member_count?: number;
}

interface UserData {
  id: number;
  name: string;
  email: string;
  profile_picture_url?: string | null;
  is_admin: boolean;
}

export default function PaginaClubes() {
  const [clubes, setClubes] = useState<Club[]>([]);
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descricao, setDescricao] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchClubes();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (err) {
      console.error('Erro ao buscar usuário:', err);
    }
  };

  const fetchClubes = async () => {
    try {
      const res = await fetch('/api/clubs');
      if (res.ok) {
        const data = await res.json();
        setClubes(data);
      }
    } catch (err) {
      console.error('Erro ao buscar:', err);
    } finally {
      setLoading(false);
    }
  };

  const cadastrarClube = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!nome.trim()) return alert('Digite um nome!');

    setSubmitting(true);
    try {
      const res = await fetch('/api/clubs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nome.trim(),
          category: categoria.trim() || 'Geral',
          description: descricao.trim(),
        }),
      });

      if (res.ok) {
        setNome('');
        setCategoria('');
        setDescricao('');
        setShowForm(false);
        fetchClubes();
      } else {
        const error = await res.json();
        alert(error.error || 'Erro ao criar clube');
      }
    } catch (err) {
      console.error('Erro ao cadastrar:', err);
      alert('Erro ao cadastrar clube');
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Tecnologia: 'bg-blue-100 text-blue-800 border-blue-200',
      Esporte: 'bg-green-100 text-green-800 border-green-200',
      Arte: 'bg-purple-100 text-purple-800 border-purple-200',
      Ciência: 'bg-orange-100 text-orange-800 border-orange-200',
      Geral: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[category as keyof typeof colors] || colors.Geral;
  };

  return (
    <div className={highContrast ? 'min-h-screen bg-black text-white' : 'min-h-screen bg-gradient-to-br from-slate-50 to-blue-50'}>
      <div className={highContrast ? 'bg-black shadow-sm border-b border-gray-700' : 'bg-white shadow-sm border-b'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-6 gap-4">
            <div>
              <h1 className={highContrast ? 'text-white text-3xl font-bold' : 'text-3xl font-bold text-gray-900'}>Clubes da Universidade</h1>
              <p className={highContrast ? 'text-gray-300 mt-2' : 'text-gray-500 mt-2'}>
                {user ? `Bem-vindo, ${user.name.split(' ')[0]}!` : 'Entre para criar e participar dos clubes.'}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <button
                onClick={() => setHighContrast((current) => !current)}
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-all duration-200"
              >
                {highContrast ? 'Contraste normal' : 'Alto contraste'}
              </button>
              <button
                onClick={() => {
                  if (!user) {
                    router.push('/login');
                    return;
                  }
                  setShowForm((current) => !current);
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {user ? 'Novo Clube' : 'Entrar para criar'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm && (
          <div className="mb-8 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
              <h3 className="text-xl font-semibold text-white">Criar Novo Clube</h3>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Clube *</label>
                  <input
                    type="text"
                    placeholder="Ex: Clube de Programação"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Selecione uma categoria</option>
                    <option value="Tecnologia">Tecnologia</option>
                    <option value="Esporte">Esporte</option>
                    <option value="Arte">Arte</option>
                    <option value="Ciência">Ciência</option>
                    <option value="Geral">Geral</option>
                  </select>
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                <textarea
                  placeholder="Descreva o clube, seus objetivos e atividades..."
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  rows={4}
                />
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={cadastrarClube}
                  disabled={submitting}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {submitting ? 'Criando...' : 'Criar Clube'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
            <h3 className="text-xl font-semibold text-gray-900">Clubes Ativos ({clubes.length})</h3>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : clubes.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="mt-4 text-lg font-medium text-gray-900">Nenhum clube encontrado</h3>
                <p className="mt-2 text-gray-500">Seja o primeiro a criar um clube!</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {clubes.map((clube) => (
                  <div key={clube.id} className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{clube.name}</h4>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(clube.category)}`}>{clube.category}</span>
                        <p className="text-xs text-gray-500 mt-2">{clube.member_count ?? 0} membro{(clube.member_count ?? 0) === 1 ? '' : 's'}</p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                    </div>
                    {clube.description && <p className="text-gray-600 text-sm mb-4 line-clamp-3">{clube.description}</p>}
                    <Link href={`/clubes/${clube.id}`} className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                      Ver detalhes
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
