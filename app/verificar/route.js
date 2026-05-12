// app/api/verificar/route.js
import { query } from '@/lib/db';

export async function POST(request) {
  try {
    const { email, codigo } = await request.json();
    
    // O código aqui é o ID do usuário (autoincrementado)
    const res = await query(
      'UPDATE usuarios SET verificado = true WHERE email = $1 AND id = $2 RETURNING *',
      [email, parseInt(codigo)]
    );

    if (res.rowCount > 0) {
      return new Response(JSON.stringify({ message: "✅ Conta verificada!" }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: "E-mail ou código inválido." }), { status: 400 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: "Erro no servidor" }), { status: 500 });
  }
}