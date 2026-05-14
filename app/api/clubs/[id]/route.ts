import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: clubId } = await params;

    const clubResult = await query('SELECT * FROM clubs WHERE id = ?', [clubId]);
    if (clubResult.rows.length === 0) {
      return NextResponse.json({ error: 'Clube não encontrado' }, { status: 404 });
    }

    const club = clubResult.rows[0];

    const membersResult = await query(
      'SELECT m.id, u.id AS user_id, u.name, u.email, m.joined_at FROM members m JOIN users u ON u.id = (SELECT user_id FROM users WHERE email = m.email) WHERE m.club_id = ? ORDER BY m.joined_at DESC',
      [clubId]
    );

    const eventsResult = await query(
      'SELECT id, title, description, event_date, location FROM events WHERE club_id = ? ORDER BY event_date DESC',
      [clubId]
    );

    return NextResponse.json({
      ...club,
      members: membersResult.rows,
      events: eventsResult.rows,
    });
  } catch (error) {
    console.error('Error fetching club details:', error);
    return NextResponse.json({ error: 'Failed to fetch club details' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { id: clubId } = await params;
    const { name, category, description } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const result = await query(
      'UPDATE clubs SET name = ?, category = ?, description = ? WHERE id = ?',
      [name, category || 'Geral', description || '', clubId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Clube não encontrado' }, { status: 404 });
    }

    const updatedClub = await query('SELECT * FROM clubs WHERE id = ?', [clubId]);
    return NextResponse.json(updatedClub.rows[0]);
  } catch (error) {
    console.error('Error updating club:', error);
    return NextResponse.json({ error: 'Failed to update club' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { id: clubId } = await params;
    const result = await query('DELETE FROM clubs WHERE id = ?', [clubId]);
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Clube não encontrado' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Clube removido com sucesso' });
  } catch (error) {
    console.error('Error deleting club:', error);
    return NextResponse.json({ error: 'Failed to delete club' }, { status: 500 });
  }
}
