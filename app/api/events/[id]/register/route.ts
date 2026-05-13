import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;
    const { member_id } = await request.json();

    if (!member_id) {
      return NextResponse.json({ error: 'Member ID is required' }, { status: 400 });
    }

    // Check if event exists
    const eventResult = await pool.query('SELECT id FROM events WHERE id = $1', [eventId]);
    if (eventResult.rows.length === 0) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Check if member exists
    const memberResult = await pool.query('SELECT id FROM members WHERE id = $1', [member_id]);
    if (memberResult.rows.length === 0) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    // Check if already registered
    const existingRegistration = await pool.query(
      'SELECT id FROM event_registrations WHERE event_id = $1 AND member_id = $2',
      [eventId, member_id]
    );
    if (existingRegistration.rows.length > 0) {
      return NextResponse.json({ error: 'Already registered for this event' }, { status: 400 });
    }

    const result = await pool.query(
      'INSERT INTO event_registrations (event_id, member_id) VALUES ($1, $2) RETURNING *',
      [eventId, member_id]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error registering for event:', error);
    return NextResponse.json({ error: 'Failed to register for event' }, { status: 500 });
  }
}