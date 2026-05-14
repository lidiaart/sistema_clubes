import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth/config';
import { getUserRoles } from '../../lib/permissions/checkRole';
import { query } from '../../lib/db';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) return <div>Unauthorized</div>;

  const userId = Number(session.user.id);
  const roles = await getUserRoles(userId);
  const isAdminSystem = roles.some((r) => r.role === 'admin_system');
  const isAdminClub = roles.some((r) => r.role === 'admin_club');

  const displayName = session.user.name || session.user.email || 'usuário';
  const roleLabel = isAdminSystem
    ? 'Administrador do sistema'
    : isAdminClub
    ? 'Administrador do clube'
    : 'Membro';

  let stats: Record<string, string | number> = {};
  if (isAdminSystem) {
    const clubs = await query('SELECT COUNT(*) FROM clubs');
    const users = await query('SELECT COUNT(*) FROM users');
    stats = {
      'Clubes ativos': Number(clubs.rows[0].count),
      'Usuários cadastrados': Number(users.rows[0].count),
    };
  } else if (isAdminClub) {
    const clubId = roles.find((r) => r.club_id)?.club_id;
    const members = await query('SELECT COUNT(*) FROM members WHERE club_id = $1', [clubId]);
    const events = await query('SELECT COUNT(*) FROM events WHERE club_id = $1', [clubId]);
    stats = {
      'Membros no clube': Number(members.rows[0].count),
      'Eventos agendados': Number(events.rows[0].count),
    };
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.16),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.12),_transparent_30%)] pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-[32px] border border-white/10 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-sm">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Painel</p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">Olá, {displayName}.</h1>
                <p className="mt-4 max-w-2xl text-slate-300">
                  {isAdminSystem
                    ? 'Acompanhe o desempenho do sistema e mantenha o controle dos clubes e usuários.'
                    : isAdminClub
                    ? 'Gerencie seu clube com clareza, acompanhe membros e eventos em um só lugar.'
                    : 'Confira seus clubes e participe dos próximos eventos disponíveis.'}
                </p>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-white/5 px-6 py-5 text-slate-100 shadow-lg shadow-slate-950/20">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Seu perfil</p>
                <p className="mt-3 text-lg font-semibold">{roleLabel}</p>
              </div>
            </div>
          </div>

          <section className="mt-10 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {Object.entries(stats).length > 0 ? (
              Object.entries(stats).map(([key, value]) => (
                <div key={key} className="group rounded-[28px] border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/40 transition hover:-translate-y-1 hover:border-cyan-500/30">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{key}</p>
                  <p className="mt-4 text-4xl font-semibold text-white">{value}</p>
                </div>
              ))
            ) : (
              <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-8 shadow-lg shadow-slate-950/40">
                <p className="text-lg font-semibold text-white">Bem-vindo ao painel</p>
                <p className="mt-3 text-slate-300">Navegue pelos clubes para encontrar novas atividades e eventos.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
