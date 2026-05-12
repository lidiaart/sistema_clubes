// app/clubes/page.js
'use client'; 
import { useState, useEffect } from 'react';

export default function PaginaClubes() {
  const [clubes, setClubes] = useState([]);
  const [nome, setNome] = useState('');

  // Esta parte busca os dados do banco assim que a página abre
  useEffect(() => {
    fetch('/api/clubes')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setClubes(data);
      })
      .catch(err => console.error("Erro ao buscar:", err));
  }, []);

  // Esta parte envia o nome de um novo clube para o banco
  const cadastrarClube = async () => {
    if (!nome) return alert("Digite um nome!");

    await fetch('/api/clubes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        nome: nome, 
        categoria: 'Geral', 
        descricao: 'Criado via painel' 
      })
    });
    
    setNome(''); // Limpa o campo
    location.reload(); // Atualiza a lista
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial' }}>
      <h1>Sistema de Gestão de Clubes</h1>
      
      {/* Formulário para Criar */}
      <div style={{ background: '#f4f4f4', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h3>Cadastrar Novo Clube</h3>
        <input 
          type="text" 
          placeholder="Ex: Clube de Xadrez" 
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          style={{ padding: '10px', width: '250px', marginRight: '10px' }}
        />
        <button onClick={cadastrarClube} style={{ padding: '10px 20px', cursor: 'pointer', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '5px' }}>
          Adicionar Clube
        </button>
      </div>

      {/* Lista de Clubes que vêm do PostgreSQL */}
      <h3>Clubes Ativos:</h3>
      <div style={{ display: 'grid', gap: '10px' }}>
        {clubes.length === 0 && <p>Nenhum clube cadastrado ainda.</p>}
        {clubes.map((clube) => (
          <div key={clube.id} style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
            <strong>{clube.nome}</strong> <br />
            <small>Categoria: {clube.categoria}</small>
          </div>
        ))}
      </div>
    </div>
  );
}