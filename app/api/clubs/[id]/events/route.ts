import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: clubId } = await params;

    const result = await pool.query(
      'SELECT id, title, description, event_date, location FROM events WHERE club_id = $1 ORDER BY event_date DESC',
      [clubId]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: clubId } = await params;
    const { title, description, event_date, location } = await request.json();

    if (!title || !event_date) {
      return NextResponse.json({ error: 'Title and event date are required' }, { status: 400 });
    }

    // Check if club exists
    const clubResult = await pool.query('SELECT id FROM clubs WHERE id = $1', [clubId]);
    if (clubResult.rows.length === 0) {
      return NextResponse.json({ error: 'Club not found' }, { status: 404 });
    }

    const result = await pool.query(
      'INSERT INTO events (title, description, club_id, event_date, location) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description || '', clubId, event_date, location || '']
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}