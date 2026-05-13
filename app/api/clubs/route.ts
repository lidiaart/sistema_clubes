import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM clubs ORDER BY created_at DESC');
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

    const result = await pool.query(
      'INSERT INTO clubs (name, category, description) VALUES ($1, $2, $3) RETURNING *',
      [name, category || 'General', description || '']
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating club:', error);
    return NextResponse.json({ error: 'Failed to create club' }, { status: 500 });
  }
}