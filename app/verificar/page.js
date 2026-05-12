import { Pool } from 'pg';

// Cria a conexão com o seu banco PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Essa função será usada pelas APIs para rodar os comandos SQL
export const query = (text, params) => pool.query(text, params);