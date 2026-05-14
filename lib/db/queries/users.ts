import { query } from '../../db';
import bcrypt from 'bcryptjs';

export async function createUser(email: string, password: string, name: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await query(
    'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)',
    [email, hashedPassword, name]
  );
  // Get the inserted user
  const userResult = await query('SELECT id, email, name FROM users WHERE email = ?', [email]);
  return userResult.rows[0];
}

export async function findUserByEmail(email: string) {
  const result = await query('SELECT * FROM users WHERE email = ?', [email]);
  return result.rows[0];
}

export async function verifyPassword(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) return null;
  const isValid = await bcrypt.compare(password, user.password_hash);
  return isValid ? user : null;
}

export async function assignRole(userId: number, roleName: string, clubId?: number) {
  const roleResult = await query('SELECT id FROM roles WHERE name = ?', [roleName]);
  const roleId = roleResult.rows[0]?.id;
  if (!roleId) throw new Error('Role not found');

  await query(
    'INSERT INTO user_roles (user_id, role_id, club_id) VALUES (?, ?, ?)',
    [userId, roleId, clubId]
  );
}