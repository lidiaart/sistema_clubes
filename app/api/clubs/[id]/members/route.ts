import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: clubId } = await params;

    const result = await pool.query(
      'SELECT id, name, email, joined_at FROM members WHERE club_id = $1 ORDER BY joined_at DESC',
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
    const { id: clubId } = await params;
    const { name, email } = await request.json();

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    // Check if club exists
    const clubResult = await pool.query('SELECT id FROM clubs WHERE id = $1', [clubId]);
    if (clubResult.rows.length === 0) {
      return NextResponse.json({ error: 'Club not found' }, { status: 404 });
    }

    // Check if member already exists in this club
    const existingMember = await pool.query(
      'SELECT id FROM members WHERE email = $1 AND club_id = $2',
      [email, clubId]
    );
    if (existingMember.rows.length > 0) {
      return NextResponse.json({ error: 'Member already in this club' }, { status: 400 });
    }

    const result = await pool.query(
      'INSERT INTO members (name, email, club_id) VALUES ($1, $2, $3) RETURNING *',
      [name, email, clubId]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error joining club:', error);
    return NextResponse.json({ error: 'Failed to join club' }, { status: 500 });
  }
}