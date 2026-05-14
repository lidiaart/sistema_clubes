import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'database.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

export async function query<T = any>(text: string, params?: unknown[]): Promise<{ rows: T[] }> {
  try {
    const stmt = db.prepare(text);
    const isSelect = text.trim().toUpperCase().startsWith('SELECT') || text.trim().toUpperCase().startsWith('PRAGMA');

    if (isSelect) {
      return { rows: params ? stmt.all(params) : stmt.all() } as { rows: T[] };
    } else {
      const result = params ? stmt.run(params) : stmt.run();
      return { rows: [{ ...result, insertId: result.lastInsertRowid }] } as { rows: T[] };
    }
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export default db;