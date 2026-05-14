import { query } from '../../db';

export async function createRequestAdminClub(userId: number, clubId: number) {
  // Verificar tentativas em 90 dias
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  const attemptsResult = await query(
    `SELECT COUNT(*) as count FROM requests_admin_club
     WHERE user_id = ? AND club_id = ? AND last_attempt > ?`,
    [userId, clubId, ninetyDaysAgo]
  );
  const attempts = parseInt(attemptsResult.rows[0].count);

  if (attempts >= 2) {
    await query(
      'INSERT INTO requests_admin_club (user_id, club_id, status) VALUES (?, ?, ?)',
      [userId, clubId, 'blocked']
    );
    throw new Error('Máximo de tentativas atingido');
  }

  const result = await query(
    'INSERT INTO requests_admin_club (user_id, club_id, attempts) VALUES (?, ?, ?)',
    [userId, clubId, attempts + 1]
  );
  // Get the inserted request
  const requestResult = await query('SELECT * FROM requests_admin_club WHERE user_id = ? AND club_id = ? ORDER BY id DESC LIMIT 1', [userId, clubId]);
  return requestResult.rows[0];
}

export async function approveOrRejectAdminRequest(requestId: number, action: 'approve' | 'reject', adminSystemId: number) {
  const request = await query('SELECT * FROM requests_admin_club WHERE id = ?', [requestId]);
  if (!request.rows[0]) throw new Error('Request not found');

  const status = action === 'approve' ? 'approved' : 'rejected';
  await query('UPDATE requests_admin_club SET status = ? WHERE id = ?', [status, requestId]);

  if (action === 'approve') {
    const roleResult = await query('SELECT id FROM roles WHERE name = ?', ['admin_club']);
    const roleId = roleResult.rows[0]?.id;
    if (roleId) {
      await query(
        'INSERT INTO user_roles (user_id, role_id, club_id) VALUES (?, ?, ?)',
        [request.rows[0].user_id, roleId, request.rows[0].club_id]
      );
    }
  }
}

export async function createRequestJoinClub(userId: number, clubId: number) {
  const result = await query(
    'INSERT INTO requests_join_club (user_id, club_id) VALUES (?, ?)',
    [userId, clubId]
  );
  // Get the inserted request
  const requestResult = await query('SELECT * FROM requests_join_club WHERE user_id = ? AND club_id = ? ORDER BY id DESC LIMIT 1', [userId, clubId]);
  return requestResult.rows[0];
}

export async function approveOrRejectJoinRequest(requestId: number, action: 'approve' | 'reject') {
  const request = await query('SELECT * FROM requests_join_club WHERE id = ?', [requestId]);
  if (!request.rows[0]) throw new Error('Request not found');

  const status = action === 'approve' ? 'approved' : 'rejected';
  await query('UPDATE requests_join_club SET status = ? WHERE id = ?', [status, requestId]);

  if (action === 'approve') {
    // Assumir que members é para membros de clube, mas precisa de name/email. Ajustar se necessário.
    const user = await query('SELECT name, email FROM users WHERE id = ?', [request.rows[0].user_id]);
    await query(
      'INSERT INTO members (name, email, club_id) VALUES (?, ?, ?)',
      [user.rows[0].name, user.rows[0].email, request.rows[0].club_id]
    );
  }
}