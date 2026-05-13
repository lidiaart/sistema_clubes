// app/clubes/[id]/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Member {
  id: number;
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

export default function ClubDetails() {
  const params = useParams();
  const clubId = params.id as string;
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');

  useEffect(() => {
    fetchClubDetails();
  }, [clubId]);

  const fetchClubDetails = async () => {
    try {
      const res = await fetch(`/api/clubs/${clubId}`);
      if (res.ok) {
        const data = await res.json();
        setClub(data);
      }
    } catch (err) {
      console.error("Erro ao buscar detalhes:", err);
    } finally {
      setLoading(false);
    }
  };

  const joinClub = async () => {
    if (!memberName.trim() || !memberEmail.trim()) return alert("Preencha nome e email!");

    try {
      const res = await fetch(`/api/clubs/${clubId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: memberName.trim(),
          email: memberEmail.trim()
        })
      });

      if (res.ok) {
        setMemberName('');
        setMemberEmail('');
        fetchClubDetails();
      } else {
        const error = await res.json();
        alert(error.error || 'Erro ao entrar no clube');
      }
    } catch (err) {
      console.error("Erro ao entrar:", err);
      alert('Erro ao entrar no clube');
    }
  };

  const createEvent = async () => {
    if (!eventTitle.trim() || !eventDate) return alert("Preencha título e data!");

    try {
      const res = await fetch(`/api/clubs/${clubId}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: eventTitle.trim(),
          description: eventDescription.trim(),
          event_date: eventDate,
          location: eventLocation.trim()
        })
      });

      if (res.ok) {
        setEventTitle('');
        setEventDescription('');
        setEventDate('');
        setEventLocation('');
        fetchClubDetails();
      } else {
        alert('Erro ao criar evento');
      }
    } catch (err) {
      console.error("Erro ao criar evento:", err);
      alert('Erro ao criar evento');
    }
  };

  const registerForEvent = async (eventId: number) => {
    const memberId = prompt('Digite o ID do membro:');
    if (!memberId) return;

    try {
      const res = await fetch(`/api/events/${eventId}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ member_id: parseInt(memberId) })
      });

      if (res.ok) {
        alert('Inscrito com sucesso!');
      } else {
        const error = await res.json();
        alert(error.error || 'Erro ao se inscrever');
      }
    } catch (err) {
      console.error("Erro ao se inscrever:", err);
      alert('Erro ao se inscrever');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  if (!club) {
    return <div className="min-h-screen flex items-center justify-center">Clube não encontrado</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Link href="/clubes" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">← Voltar aos clubes</Link>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{club.name}</h1>
          <p className="text-gray-600 mb-2">Categoria: {club.category}</p>
          {club.description && <p className="text-gray-700">{club.description}</p>}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Membros */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Membros ({club.members.length})</h2>

            <div className="space-y-4 mb-6">
              <input
                type="text"
                placeholder="Nome"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={joinClub}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Entrar no Clube
              </button>
            </div>

            <div className="space-y-2">
              {club.members.map((member) => (
                <div key={member.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-gray-600">{member.email}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    Entrou em {new Date(member.joined_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Eventos */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Eventos ({club.events.length})</h2>

            <div className="space-y-4 mb-6">
              <input
                type="text"
                placeholder="Título do evento"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Descrição"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
              <input
                type="datetime-local"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Localização"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={createEvent}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Criar Evento
              </button>
            </div>

            <div className="space-y-3">
              {club.events.map((event) => (
                <div key={event.id} className="p-4 border border-gray-200 rounded-md">
                  <h3 className="font-semibold">{event.title}</h3>
                  {event.description && <p className="text-sm text-gray-700 mb-2">{event.description}</p>}
                  <p className="text-sm text-gray-600">Data: {new Date(event.event_date).toLocaleString()}</p>
                  {event.location && <p className="text-sm text-gray-600">Local: {event.location}</p>}
                  <button
                    onClick={() => registerForEvent(event.id)}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Inscrever-se
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}