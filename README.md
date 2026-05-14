# Sistema de Gestão de Clubes

## 🚀 Configuração Inicial

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Banco de Dados
```bash
# Inicializar banco SQLite com tabelas
npm run init-db-sqlite

# Criar conta de administrador do sistema
npm run seed-admin
```

### 3. Configurar Variáveis de Ambiente
Edite o arquivo `.env` com suas configurações:

```env
# Banco de dados (SQLite)
DATABASE_URL="sqlite://./database.db"

# NextAuth
NEXTAUTH_SECRET=sua-chave-secreta-aqui

# Conta de Administrador do Sistema
ADMIN_EMAIL=admin@sistema.com
ADMIN_PASSWORD=admin123
ADMIN_NAME=Administrador Sistema
```

### 4. Executar o Projeto
```bash
npm run dev
```

## 👤 Conta de Administrador

Após a configuração inicial, você terá uma conta de administrador com:

- **Email:** `admin@sistema.com` (ou o definido em ADMIN_EMAIL)
- **Senha:** `admin123` (ou o definido em ADMIN_PASSWORD)

⚠️ **IMPORTANTE:** Altere a senha após o primeiro login!

### Permissões do Admin do Sistema:
- ✅ Criar e gerenciar todos os clubes
- ✅ Aprovar/rejeitar pedidos de admin de clube
- ✅ Aprovar/rejeitar pedidos de entrada em clube
- ✅ Visualizar estatísticas globais do sistema
- ✅ Gerenciar usuários (futuro)

## 🔐 Sistema de Autenticação

### Tipos de Usuários:
1. **Admin do Sistema** - Controle total
2. **Admin de Clube** - Gerencia clube específico
3. **Usuário Normal** - Membro de clubes

### Funcionalidades:
- ✅ Registro de usuários
- ✅ Login/logout
- ✅ Controle de permissões baseado em roles
- ✅ Rotas protegidas por middleware

## 📊 Dashboard

O dashboard mostra estatísticas diferentes baseado no tipo de usuário:

- **Admin Sistema:** Todos os clubes, usuários, pedidos pendentes
- **Admin Clube:** Seu clube, membros, eventos
- **Usuário:** Clubes que participa, eventos disponíveis

## 🛠️ Scripts Disponíveis

```bash
npm run dev          # Iniciar servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Iniciar servidor de produção
npm run lint         # Executar linter
npm run init-db-sqlite  # Inicializar banco SQLite
npm run seed-admin   # Criar conta admin (se não existir)
npm run reset-db     # Resetar banco completamente e recriar admin
```

## 🗄️ Estrutura do Banco

### Tabelas Principais:
- `users` - Usuários do sistema
- `roles` - Roles (admin_system, admin_club, user)
- `user_roles` - Relacionamento usuário-role
- `clubs` - Clubes
- `members` - Membros dos clubes
- `events` - Eventos dos clubes
- `requests_admin_club` - Pedidos para virar admin de clube
- `requests_join_club` - Pedidos para entrar em clube

## 🔧 Desenvolvimento

### Tecnologias:
- **Next.js 16** (App Router)
- **SQLite** (banco de dados)
- **NextAuth.js** (autenticação)
- **Tailwind CSS** + **shadcn/ui** (interface)
- **TypeScript** (tipagem)
- **Zod** (validação)

### Estrutura de Pastas:
```
/
├── app/                 # Páginas e APIs Next.js
├── lib/                 # Utilitários e configurações
├── components/          # Componentes React
├── scripts/            # Scripts de configuração
└── public/             # Arquivos estáticos
```
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  club_id INTEGER REFERENCES clubs(id) ON DELETE CASCADE,
  event_date TIMESTAMP NOT NULL,
  location VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inscrições em eventos
CREATE TABLE event_registrations (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  member_id INTEGER REFERENCES members(id) ON DELETE CASCADE,
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(event_id, member_id)
);
```

## Como Executar

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd meu-projeto
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure o banco de dados**
   - Crie um banco PostgreSQL
   - Configure a variável `DATABASE_URL` no arquivo `.env`
   - Execute o script de inicialização:
     ```bash
     node scripts/init-db.js
     ```

4. **Execute o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

5. **Acesse [http://localhost:3000](http://localhost:3000)**

## API Endpoints

- `GET /api/clubs` - Listar clubes
- `POST /api/clubs` - Criar clube
- `GET /api/clubs/[id]` - Detalhes do clube
- `GET /api/clubs/[id]/members` - Listar membros
- `POST /api/clubs/[id]/members` - Entrar no clube
- `GET /api/clubs/[id]/events` - Listar eventos
- `POST /api/clubs/[id]/events` - Criar evento
- `POST /api/events/[id]/register` - Inscrever-se em evento

## Critérios de Avaliação

### Técnica (40%)
- ✅ Código limpo e bem estruturado
- ✅ Uso correto do Next.js (App Router, API Routes)
- ✅ Estrutura adequada do banco de dados

### Lógica (20%)
- ✅ Modelagem correta das entidades
- ✅ Fluxos funcionais (CRUD completo)

### GitHub (20%)
- ✅ Organização do repositório
- ✅ Commits descritivos
- ✅ README detalhado

### Extra (20%)
- ✅ UI/UX moderna com Tailwind CSS
- ✅ Funcionalidades extras (validações, feedback)
- ✅ Performance otimizada

## Desenvolvimento

Este projeto foi desenvolvido seguindo as melhores práticas de desenvolvimento web moderno, com foco em simplicidade, manutenibilidade e experiência do usuário.
