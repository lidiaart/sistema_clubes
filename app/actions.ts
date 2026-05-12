'use server'

import { Pool } from 'pg';

export async function testarBanco() {
  // Criamos o pool usando a URL que está no seu arquivo .env
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const res = await pool.query('SELECT NOW()');
    return { 
      status: "Conectado com sucesso!", 
      horarioBanco: res.rows[0].now 
    };
  } catch (err: any) {
    console.error("Erro detalhado:", err);
    return { 
      status: "Erro ao conectar", 
      mensagem: err.message || "Erro desconhecido" 
    };
  } finally {
    // É importante fechar para não esgotar as conexões do banco
    await pool.end();
  }
}