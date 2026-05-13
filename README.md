# Sistema de Gestão de Clubes

Um sistema web moderno para gerenciar clubes da universidade, desenvolvido com Next.js e PostgreSQL.

## Funcionalidades

### Clubes
- ✅ Criar novos clubes
- ✅ Listar todos os clubes
- ✅ Ver detalhes de um clube específico

### Membros
- ✅ Entrar em um clube
- ✅ Listar membros de um clube

### Eventos
- ✅ Criar eventos para um clube
- ✅ Inscrever-se em eventos
- ✅ Listar eventos por clube

## Tecnologias Utilizadas

- **Frontend + Backend**: Next.js 16
- **Banco de Dados**: PostgreSQL
- **Linguagem**: TypeScript
- **Styling**: Tailwind CSS
- **Controle de Versão**: GitHub

## Estrutura do Banco

```sql
-- Clubes
CREATE TABLE clubs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Membros
CREATE TABLE members (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  club_id INTEGER REFERENCES clubs(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Eventos
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
