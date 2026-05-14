# Sistema de Gestão de Clubes

Projeto de administração de clubes, membros e eventos com autenticação, controle de permissões e uma interface renovada.

## 🚀 Instalação

1. Instale as dependências:

```bash
npm install
```

2. Configure o arquivo `.env` com suas credenciais e a URL do banco de dados.

3. Inicialize o banco de dados:

```bash
npm run init-db-sqlite
```

Se preferir usar PostgreSQL, execute `npm run init-db` e ajuste `DATABASE_URL` conforme necessário.

4. Crie o administrador do sistema:

```bash
npm run seed-admin
```

5. Inicie a aplicação:

```bash
npm run dev
```

## 🔧 Scripts disponíveis

- `npm run dev` — iniciar servidor de desenvolvimento
- `npm run build` — criar build de produção
- `npm run start` — iniciar servidor de produção
- `npm run lint` — verificar código com ESLint
- `npm run init-db` — inicializar banco PostgreSQL
- `npm run init-db-sqlite` — inicializar banco SQLite
- `npm run seed-admin` — criar conta de administrador
- `npm run reset-db` — resetar o banco e recriar admin

## 🧩 Funcionalidades principais

- Registro e login de usuários
- Roles para `admin_system`, `admin_club` e usuários comuns
- Rotas protegidas por middleware
- CRUD de clubes, membros e eventos
- Dashboard personalizado por perfil
- Interface com Tailwind CSS e layout responsivo

## 🗂️ Estrutura do projeto

- `app/` — páginas e rotas API do Next.js
- `components/` — componentes reutilizáveis
- `lib/` — configuração de banco, autenticação e permissões
- `scripts/` — scripts de inicialização e seed
- `public/` — ativos estáticos

## 💾 Banco de dados

A aplicação pode ser inicializada com SQLite ou PostgreSQL.

- Para SQLite: `npm run init-db-sqlite`
- Para PostgreSQL: `npm run init-db`

## 📍 Observações

- Use `npm run build` para verificar se o projeto está pronto para produção.
- Mantenha `NEXTAUTH_SECRET` configurado no `.env`.
- Altere a senha do administrador após o primeiro acesso.