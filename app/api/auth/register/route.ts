import { NextRequest, NextResponse } from 'next/server';
import { createUser, assignRole } from '../../../../lib/db/queries/users';
import { registerSchema } from '../../../../lib/validation/schemas';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = registerSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      {
        error: 'Invalid data',
        issues: result.error.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message })),
      },
      { status: 400 }
    );
  }

  try {
    const user = await createUser(result.data.email, result.data.password, result.data.name);
    await assignRole(user.id, 'user'); // Atribuir role padrão
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }
}
