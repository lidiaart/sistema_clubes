import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth/config';
import { createRequestJoinClub, approveOrRejectJoinRequest } from '../../../../lib/db/queries/requests';
import { checkRole } from '../../../../lib/permissions/checkRole';
import { requestJoinClubSchema, approveRequestSchema } from '../../../../lib/validation/schemas';
import { query } from '../../../../lib/db';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { success, data } = requestJoinClubSchema.safeParse(body);
  if (!success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });

  try {
    const userId = Number(session.user.id);
    const request = await createRequestJoinClub(userId, data.club_id);
    return NextResponse.json(request);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { success, data } = approveRequestSchema.safeParse(body);
  if (!success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });

  const request = await query('SELECT club_id FROM requests_join_club WHERE id = ?', [data.request_id]);
  const clubId = request.rows[0]?.club_id;
  const isAdmin = await checkRole('admin_club', clubId) || await checkRole('admin_system');
  if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    await approveOrRejectJoinRequest(data.request_id, data.action);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}