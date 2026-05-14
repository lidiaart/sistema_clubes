'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Member {
  id: number;
  user_id: number;
  name: string;
  email: string;
  joined_at: string;
}

interface Event {
  id: number;
  title: string;
  description: string;
  event_date: string;
  location: string;
}

interface Club {
  id: number;
  name: string;
  category: string;
  description: string;
  members: Member[];
  events: Event[];
}

interface UserData {
  id: number;
  name: string;
  email: string;
  profile_picture_url?: string | null;
  is_admin: boolean;
}

export default function ClubDetails() {
  const params = useParams();
  const clubId = params.id as string;
  const router = useRouter();
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [membershipId, setMembershipId] = useState<number | null>(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [submittingEvent, setSubmittingEvent] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchUser();
    fetchClubDetails();
  }, [clubId]);

  useEffect(() => {
    if (!user || !club) return;
    const membership = club.members.find((member) => member.user_id === user.id);
    setIsMember(Boolean(membership));
    setMembershipId(membership?.id ?? null);
  }, [user, club]);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (err) {
      console.error('Erro ao buscar usuário:', err);
    }
  };

  const fetchClubDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/clubs/${clubId}`);
      if (res.ok) {
        const data = await res.json();
        setClub(data);
      }
    } catch (err) {
      console.error('Erro ao buscar detalhes:', err);
    } finally {
      setLoading(false);
    }
  };

  const joinClub = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch(`/api/clubs/${clubId}/members`, {
        method: 'POST',
      });

      if (res.ok) {
        fetchClubDetails();
      } else {
        const error = await res.json();
        alert(error.error || 'Erro ao entrar no clube');
      }
    } catch (err) {
      console.error('Erro ao entrar:', err);
      alert('Erro ao entrar no clube');
    } finally {
      setActionLoading(false);
    }
  };

  const leaveClub = async () => {
    if (!membershipId) return;
    const confirmed = confirm('Tem certeza que deseja sair deste clube?');
    if (!confirmed) return;

    setActionLoading(true);
    try {
      const res = await fetch(`/api/clubs/${clubId}/members/${membershipId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchClubDetails();
      } else {
        const error = await res.json();
        alert(error.error || 'Erro ao sair do clube');
      }
    } catch (err) {
      console.error('Erro ao sair do clube:', err);
      alert('Erro ao sair do clube');
    } finally {
      setActionLoading(false);
    }
  };

  const createEvent = async () => {
    if (!user?.is_admin) {
      alert('Apenas administradores podem criar eventos.');
      return;
    }

    if (!eventTitle.trim() || !eventDate) {
      return alert('Preencha título e data!');
    }

    setSubmittingEvent(true);
    try {
      const res = await fetch(`/api/clubs/${clubId}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: eventTitle.trim(),
          description: eventDescription.trim(),
          event_date: eventDate,
          location: eventLocation.trim(),
        }),
      });

      if (res.ok) {
        setEventTitle('');
        setEventDescription('');
        setEventDate('');
        setEventLocation('');
        fetchClubDetails();
      } else {
        const error = await res.json();
        alert(error.error || 'Erro ao criar evento');
      }
    } catch (err) {
      console.error('Erro ao criar evento:', err);
      alert('Erro ao criar evento');
    } finally {
      setSubmittingEvent(false);
    }
  };

  const registerForEvent = async (eventId: number) => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!isMember) {
      return alert('Você precisa ser membro do clube para se inscrever.');
    }

    try {
      const res = await fetch(`/api/events/${eventId}/register`, {
        method: 'POST',
      });

      if (res.ok) {
        alert('Inscrição realizada com sucesso!');
      } else {
        const error = await res.json();
        alert(error.error || 'Erro ao se inscrever');
      }
    } catch (err) {
      console.error('Erro ao se inscrever:', err);
      alert('Erro ao se inscrever');
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Tecnologia: 'bg-blue-100 text-blue-800 border-blue-200',
      Esporte: 'bg-green-100 text-green-800 border-green-200',
      Arte: 'bg-purple-100 text-purple-800 border-purple-200',
      Ciência: 'bg-orange-100 text-orange-800 border-orange-200',
      Geral: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[category as keyof typeof colors] || colors.Geral;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Clube não encontrado</h3>
          <Link href="/clubes" className="mt-4 inline-flex text-blue-600 hover:text-blue-700">
            Voltar aos clubes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-12">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between py-6 gap-4">
            <div>
              <Link href="/clubes" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Voltar aos clubes
              </Link>
              <h1 className="mt-4 text-3xl font-bold text-gray-900">{club.name}</h1>
              <p className="mt-3 text-gray-600">{club.description || 'Descrição não disponível.'}</p>
              <span className={`inline-flex items-center mt-4 px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(club.category)}`}>
                {club.category}
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              {isMember ? (
                <button
                  type="button"
                  onClick={leaveClub}
                  disabled={actionLoading}
                  className="rounded-full bg-rose-500 px-4 py-2 text-white hover:bg-rose-600 transition disabled:opacity-60"
                >
                  {actionLoading ? 'Processando...' : 'Sair do clube'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={joinClub}
                  disabled={actionLoading}
                  className="rounded-full bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition disabled:opacity-60"
                >
                  {actionLoading ? 'Processando...' : 'Entrar no clube'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-8">
          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Eventos</h2>
                <p className="text-sm text-gray-500">Inscreva-se se for membro do clube.</p>
              </div>
              {user?.is_admin && (
                <span className="rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-sm font-medium">Admin</span>
              )}
            </div>
            {club.events.length === 0 ? (
              <div className="text-gray-500">Nenhum evento agendado.</div>
            ) : (
              <div className="space-y-4">
                {club.events.map((event) => (
                  <div key={event.id} className="rounded-3xl border border-slate-200 p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{new Date(event.event_date).toLocaleString('pt-BR')}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => registerForEvent(event.id)}
                        className="rounded-full bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
                      >
                        Inscrever
                      </button>
                    </div>
                    <p className="mt-4 text-gray-600">{event.description || 'Sem descrição adicional.'}</p>
                    {event.location && <p className="mt-3 text-sm text-gray-500">Local: {event.location}</p>}
                  </div>
                ))}
              </div>
            )}
            {user?.is_admin && (
              <div className="mt-8 rounded-3xl border border-slate-200 p-6 bg-slate-50">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Criar novo evento</h3>
                <div className="grid gap-4">
                  <input
                    type="text"
                    placeholder="Título do evento"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-slate-900 focus:outline-none"
                  />
                  <textarea
                    placeholder="Descrição do evento"
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    rows={4}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-slate-900 focus:outline-none"
                  />
                  <input
                    type="datetime-local"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-slate-900 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Local do evento"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-slate-900 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={createEvent}
                    disabled={submittingEvent}
                    className="rounded-full bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition disabled:opacity-60"
                  >
                    {submittingEvent ? 'Criando...' : 'Criar evento'}
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
        <aside className="space-y-6">
          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Membros ({club.members.length})</h2>
            {club.members.length === 0 ? (
              <p className="text-gray-500">Ainda não há membros neste clube.</p>
            ) : (
              <div className="space-y-3">
                {club.members.map((member) => (
                  <div key={member.id} className="rounded-3xl border border-slate-200 p-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.email}</p>
                      <p className="text-xs text-gray-400">Entrou em {new Date(member.joined_at).toLocaleDateString('pt-BR')}</p>
                    </div>
                    {(user?.is_admin || user?.id === member.user_id) && (
                      <button
                        type="button"
                        onClick={() => {
                          if (user?.id === member.user_id) {
                            leaveClub();
                          } else {
                            if (!confirm('Tem certeza que deseja remover este membro?')) {
                              return;
                            }
                            fetch(`/api/clubs/${clubId}/members/${member.id}`, { method: 'DELETE' })
                              .then((res) => {
                                if (res.ok) fetchClubDetails();
                                else res.json().then((data) => alert(data.error || 'Falha ao remover membro'));
                              });
                          }
                        }}
                        className="rounded-full bg-rose-500 px-3 py-2 text-white text-sm hover:bg-rose-600 transition"
                      >
                        {user?.id === member.user_id ? 'Sair' : 'Remover'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Status</h2>
            <p className="text-gray-600">{isMember ? 'Você é membro deste clube.' : 'Você ainda não faz parte deste clube.'}</p>
            {!user && <p className="text-sm text-gray-500 mt-3">Entre para fazer parte do clube e inscrever-se em eventos.</p>}
          </section>
        </aside>
      </div>
    </div>
  );
}
