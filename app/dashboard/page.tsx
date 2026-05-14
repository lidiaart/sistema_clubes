import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth/config';
import { getUserRoles } from '../../lib/permissions/checkRole';
import { query } from '../../lib/db';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) return <div>Unauthorized</div>;

  const userId = Number(session.user.id);
  const roles = await getUserRoles(userId);
  const isAdminSystem = roles.some(r => r.role === 'admin_system');
  const isAdminClub = roles.some(r => r.role === 'admin_club');

  let stats: Record<string, string | number> = {};
  if (isAdminSystem) {
    const clubs = await query('SELECT COUNT(*) FROM clubs');
    const users = await query('SELECT COUNT(*) FROM users');
    stats = { clubs: Number(clubs.rows[0].count), users: Number(users.rows[0].count) };
  } else if (isAdminClub) {
    const clubId = roles.find(r => r.club_id)?.club_id;
    const members = await query('SELECT COUNT(*) FROM members WHERE club_id = $1', [clubId]);
    const events = await query('SELECT COUNT(*) FROM events WHERE club_id = $1', [clubId]);
    stats = { members: Number(members.rows[0].count), events: Number(events.rows[0].count) };
  }

  return (
    <div className="min-h-screen bg-[#0B1F33] text-[#F7F7F7]">
      <div className="p-8">
        <h1 className="text-[#E68A2E] text-3xl mb-4">Bem-vindo(a)! Estamos felizes por ter você aqui.</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="bg-[#132E4A] p-4 rounded shadow">
              <h2 className="text-[#E68A2E]">{key}</h2>
              <p>{value}</p>
            </div>
          ))}
        </div>
      </div>
      <footer className="absolute bottom-0 w-full text-center p-4 text-[#F7F7F7]">
        Lídia Art (QUORUM)
      </footer>
    </div>
  );
}