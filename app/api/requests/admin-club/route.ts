import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth/config';
import { createRequestAdminClub, approveOrRejectAdminRequest } from '../../../../lib/db/queries/requests';
import { checkRole } from '../../../../lib/permissions/checkRole';
import { requestAdminClubSchema, approveRequestSchema } from '../../../../lib/validation/schemas';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { success, data } = requestAdminClubSchema.safeParse(body);
  if (!success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });

  try {
    const userId = Number(session.user.id);
    const request = await createRequestAdminClub(userId, data.club_id);
    return NextResponse.json(request);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const isAdminSystem = await checkRole('admin_system');
  if (!isAdminSystem) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const { success, data } = approveRequestSchema.safeParse(body);
  if (!success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });

  try {
    const userId = Number(session.user.id);
    await approveOrRejectAdminRequest(data.request_id, data.action, userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}