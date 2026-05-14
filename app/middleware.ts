import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    // Lógica adicional se necessário
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/clubes/:path*', '/profile/:path*'], // Rotas protegidas
};