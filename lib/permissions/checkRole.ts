import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/config';
import { query } from '../db';

export async function checkRole(requiredRole: 'admin_system' | 'admin_club' | 'user', clubId?: number): Promise<boolean> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return false;

  const userId = session.user.id;

  const result = await query(
    `SELECT r.name FROM user_roles ur
     JOIN roles r ON ur.role_id = r.id
     WHERE ur.user_id = ? AND r.name = ? ${clubId ? 'AND ur.club_id = ?' : ''}`,
    clubId ? [userId, requiredRole, clubId] : [userId, requiredRole]
  );

  return result.rows.length > 0;
}

export async function getUserRoles(userId: number): Promise<{ role: string; club_id?: number }[]> {
  const result = await query(
    `SELECT r.name as role, ur.club_id FROM user_roles ur
     JOIN roles r ON ur.role_id = r.id
     WHERE ur.user_id = ?`,
    [userId]
  );
  return result.rows;
}