import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: clubId } = await params;

    const result = await query(
      'SELECT m.id, u.name, u.email, m.joined_at FROM memberships m JOIN users u ON u.id = m.user_id WHERE m.club_id = $1 ORDER BY m.joined_at DESC',
      [clubId]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id: clubId } = await params;

    const clubResult = await query('SELECT id FROM clubs WHERE id = $1', [clubId]);
    if (clubResult.rows.length === 0) {
      return NextResponse.json({ error: 'Clube não encontrado' }, { status: 404 });
    }

    const existingMembership = await query(
      'SELECT id FROM memberships WHERE user_id = $1 AND club_id = $2',
      [user.id, clubId]
    );
    if (existingMembership.rows.length > 0) {
      return NextResponse.json({ error: 'Você já é membro deste clube' }, { status: 400 });
    }

    const result = await query(
      'INSERT INTO memberships (user_id, club_id) VALUES ($1, $2) RETURNING id, joined_at',
      [user.id, clubId]
    );

    return NextResponse.json(
      {
        id: result.rows[0].id,
        name: user.name,
        email: user.email,
        joined_at: result.rows[0].joined_at,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error joining club:', error);
    return NextResponse.json({ error: 'Falha ao entrar no clube' }, { status: 500 });
  }
}