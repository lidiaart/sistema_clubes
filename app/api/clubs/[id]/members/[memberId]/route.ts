import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  const user = await getSessionUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { id: clubId, memberId } = await params;

    const membershipResult = await query(
      'SELECT id, user_id FROM memberships WHERE id = $1 AND club_id = $2',
      [memberId, clubId]
    );

    if (membershipResult.rows.length === 0) {
      return NextResponse.json({ error: 'Membro não encontrado' }, { status: 404 });
    }

    const membership = membershipResult.rows[0];
    if (membership.user_id !== user.id && !user.is_admin) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
    }

    await query('DELETE FROM memberships WHERE id = $1', [memberId]);
    return NextResponse.json({ message: 'Membro removido com sucesso' });
  } catch (error) {
    console.error('Error deleting membership:', error);
    return NextResponse.json({ error: 'Falha ao remover membro' }, { status: 500 });
  }
}
