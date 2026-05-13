import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Sistema de Gestão de Clubes
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Gerencie clubes da universidade, membros e eventos de forma simples e eficiente.
        </p>
        <div className="space-y-4">
          <Link
            href="/clubes"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Ver Clubes
          </Link>
          <p className="text-sm text-gray-500">
            Desenvolvido com Next.js e PostgreSQL
          </p>
        </div>
      </div>
    </div>
  );
}