import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSessionUser, hashPassword } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const user = await getSessionUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  return NextResponse.json(user);
}

export async function PUT(request: NextRequest) {
  const user = await getSessionUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { name, email, profile_picture_url, password } = await request.json();

    if (!name || !email) {
      return NextResponse.json({ error: 'Nome e email são obrigatórios' }, { status: 400 });
    }

    const passwordHash = password ? hashPassword(password) : undefined;

    const values = [name, email, profile_picture_url || null, user.id];
    const sqlQuery = passwordHash
      ? 'UPDATE users SET name = $1, email = $2, profile_picture_url = $3, password_hash = $4 WHERE id = $5 RETURNING id, name, email, profile_picture_url, is_admin'
      : 'UPDATE users SET name = $1, email = $2, profile_picture_url = $3 WHERE id = $5 RETURNING id, name, email, profile_picture_url, is_admin';

    if (passwordHash) {
      values.splice(3, 0, passwordHash);
    }

    const result = await query(sqlQuery, values);
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Falha ao atualizar perfil' }, { status: 500 });
  }
}
