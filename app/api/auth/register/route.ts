import { NextRequest, NextResponse } from 'next/server';
import { createUser, assignRole } from '../../../../lib/db/queries/users';
import { registerSchema } from '../../../../lib/validation/schemas';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { success, data } = registerSchema.safeParse(body);
  if (!success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });

  try {
    const user = await createUser(data.email, data.password, data.name);
    await assignRole(user.id, 'user'); // Atribuir role padrão
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }
}
