import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    const result = await query(
      `SELECT c.*, COALESCE(m.member_count, 0) AS member_count
       FROM clubs c
       LEFT JOIN (
         SELECT club_id, COUNT(*) AS member_count
         FROM members
         GROUP BY club_id
       ) m ON m.club_id = c.id
       ORDER BY c.created_at DESC`
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching clubs:', error);
    return NextResponse.json({ error: 'Failed to fetch clubs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, category, description } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const result = await query(
      'INSERT INTO clubs (name, category, description) VALUES (?, ?, ?)',
      [name, category || 'Geral', description || '']
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating club:', error);
    return NextResponse.json({ error: 'Failed to create club' }, { status: 500 });
  }
}
