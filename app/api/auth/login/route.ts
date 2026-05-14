import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyPassword, createSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const result = await query('SELECT id, name, email, password_hash FROM users WHERE email = ?', [email]);
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }

    const user = result.rows[0];
    if (!verifyPassword(password, user.password_hash)) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }

    const sessionToken = createSessionToken(user.id);
    const response = NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      profile_picture_url: user.profile_picture_url,
      is_admin: user.is_admin,
    });
    response.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Error logging in:', error);
    return NextResponse.json({ error: 'Falha ao fazer login' }, { status: 500 });
  }
}
