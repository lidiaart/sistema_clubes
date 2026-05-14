import { getServerSession } from 'next-auth';
import { authOptions } from '../lib/auth/config';
import { getUserRoles } from '../lib/permissions/checkRole';
import Link from 'next/link';

export default async function Home() {
  const session = await getServerSession(authOptions);
  let isAdminSystem = false;
  if (session) {
    const userId = Number(session.user.id);
    const roles = await getUserRoles(userId);
    isAdminSystem = roles.some(r => r.role === 'admin_system');
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.16),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.12),_transparent_30%)] pointer-events-none" />
      <div className="relative text-center max-w-4xl mx-auto">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300 mb-4">Sistema de Gestão de Clubes</p>
        <h1 className="text-6xl font-bold text-white mb-6">Bem-vindo à nossa plataforma</h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
          Gerencie clubes, eventos e membros com segurança e design moderno. Junte-se à comunidade e participe das atividades.
        </p>
        {isAdminSystem && (
          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-6 mb-8 max-w-md mx-auto">
            <p className="text-cyan-300 font-semibold">Olá, Administrador!</p>
            <p className="text-slate-300 text-sm mt-2">Você tem acesso total ao sistema. Acesse o painel para gerenciar tudo.</p>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login" className="inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-8 py-4 text-slate-950 font-semibold shadow-lg hover:bg-cyan-400 transition">
            Entrar
          </Link>
          <Link href="/register" className="inline-flex items-center justify-center rounded-2xl border border-cyan-500 px-8 py-4 text-cyan-300 font-semibold hover:bg-cyan-500/10 transition">
            Criar conta
          </Link>
        </div>
      </div>
    </div>
  );
}


