import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Aqui o Next.js busca os dados do seu arquivo .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM clubes');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Erro no Banco:", error);
    return NextResponse.json({ error: "Erro ao buscar dados" }, { status: 500 });
  }
}