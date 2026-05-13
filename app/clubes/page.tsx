// app/clubes/page.tsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Club {
  id: number;
  name: string;
  category: string;
  description: string;
}

export default function PaginaClubes() {
  const [clubes, setClubes] = useState<Club[]>([]);
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descricao, setDescricao] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClubes();
  }, []);

  const fetchClubes = async () => {
    try {
      const res = await fetch('/api/clubs');
      if (res.ok) {
        const data = await res.json();
        setClubes(data);
      }
    } catch (err) {
      console.error("Erro ao buscar:", err);
    } finally {
      setLoading(false);
    }
  };

  const cadastrarClube = async () => {
    if (!nome.trim()) return alert("Digite um nome!");

    try {
      const res = await fetch('/api/clubs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nome.trim(),
          category: categoria.trim() || 'Geral',
          description: descricao.trim()
        })
      });

      if (res.ok) {
        setNome('');
        setCategoria('');
        setDescricao('');
        fetchClubes();
      } else {
        alert('Erro ao criar clube');
      }
    } catch (err) {
      console.error("Erro ao cadastrar:", err);
      alert('Erro ao cadastrar clube');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Sistema de Gestão de Clubes</h1>

        {/* Formulário para Criar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Cadastrar Novo Clube</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Nome do clube"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Categoria (opcional)"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Descrição (opcional)"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            <button
              onClick={cadastrarClube}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Adicionar Clube
            </button>
          </div>
        </div>

        {/* Lista de Clubes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Clubes Ativos</h3>
          {loading ? (
            <p className="text-gray-500">Carregando...</p>
          ) : clubes.length === 0 ? (
            <p className="text-gray-500">Nenhum clube cadastrado ainda.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {clubes.map((clube) => (
                <div key={clube.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-lg text-gray-900">{clube.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">Categoria: {clube.category}</p>
                  {clube.description && (
                    <p className="text-sm text-gray-700 mb-3">{clube.description}</p>
                  )}
                  <Link
                    href={`/clubes/${clube.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Ver detalhes →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}