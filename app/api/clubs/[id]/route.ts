import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: clubId } = await params;

    const clubResult = await pool.query('SELECT * FROM clubs WHERE id = $1', [clubId]);
    if (clubResult.rows.length === 0) {
      return NextResponse.json({ error: 'Club not found' }, { status: 404 });
    }

    const club = clubResult.rows[0];

    // Get members
    const membersResult = await pool.query(
      'SELECT id, name, email, joined_at FROM members WHERE club_id = $1 ORDER BY joined_at DESC',
      [clubId]
    );

    // Get events
    const eventsResult = await pool.query(
      'SELECT id, title, description, event_date, location FROM events WHERE club_id = $1 ORDER BY event_date DESC',
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