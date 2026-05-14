import { getServerSession } from 'next-auth';
import { authOptions } from '../lib/auth/config';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-[#0B1F33] text-[#F7F7F7] flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-5xl font-bold text-[#E68A2E] mb-4">Bem-vindo ao Quorum</h1>
        <p className="text-lg text-[#F7F7F7] max-w-xl mx-auto mb-8">
          Plataforma moderna para gerenciar clubes, eventos e membros com segurança e design premium.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login" className="inline-flex items-center justify-center rounded-full bg-[#E68A2E] px-6 py-3 text-white font-semibold shadow-lg hover:bg-[#d57a1e] transition">
            Entrar
          </Link>
          <Link href="/register" className="inline-flex items-center justify-center rounded-full border border-[#E68A2E] px-6 py-3 text-[#F7F7F7] font-semibold hover:bg-white/10 transition">
            Criar conta
          </Link>
        </div>
      </div>
    </div>
  );
}

