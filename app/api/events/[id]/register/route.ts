import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { id: eventId } = await params;

    const eventResult = await query('SELECT id, club_id FROM events WHERE id = $1', [eventId]);
    if (eventResult.rows.length === 0) {
      return NextResponse.json({ error: 'Evento não encontrado' }, { status: 404 });
    }

    const event = eventResult.rows[0];
    const membershipResult = await query(
      'SELECT id FROM memberships WHERE user_id = $1 AND club_id = $2',
      [user.id, event.club_id]
    );

    if (membershipResult.rows.length === 0) {
      return NextResponse.json({ error: 'Você precisa ser membro do clube para se inscrever no evento' }, { status: 403 });
    }

    const membershipId = membershipResult.rows[0].id;
    const existingRegistration = await query(
      'SELECT id FROM event_registrations WHERE event_id = $1 AND membership_id = $2',
      [eventId, membershipId]
    );

    if (existingRegistration.rows.length > 0) {
      return NextResponse.json({ error: 'Você já está inscrito neste evento' }, { status: 400 });
    }

    const result = await query(
      'INSERT INTO event_registrations (event_id, membership_id) VALUES ($1, $2) RETURNING id, registered_at',
      [eventId, membershipId]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error registering for event:', error);
    return NextResponse.json({ error: 'Falha ao registrar no evento' }, { status: 500 });
  }
}
