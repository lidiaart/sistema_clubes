-- Sistema de Gestão de Clubes - Script de Criação da Base de Dados
-- Execute este script no PostgreSQL para criar todas as tabelas necessárias

-- Criar banco de dados (descomente se necessário)
-- CREATE DATABASE club_management_db;
-- \c club_management_db;

-- Tabela de Clubes
CREATE TABLE IF NOT EXISTS clubs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  category VARCHAR(100) DEFAULT 'Geral',
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Membros
CREATE TABLE IF NOT EXISTS members (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  club_id INTEGER REFERENCES clubs(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(email, club_id)
);

-- Tabela de Eventos
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  club_id INTEGER REFERENCES clubs(id) ON DELETE CASCADE,
  event_date TIMESTAMP NOT NULL,
  location VARCHAR(255),
  max_participants INTEGER DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Inscrições em Eventos
CREATE TABLE IF NOT EXISTS event_registrations (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  member_id INTEGER REFERENCES members(id) ON DELETE CASCADE,
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(event_id, member_id)
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_clubs_category ON clubs(category);
CREATE INDEX IF NOT EXISTS idx_members_club_id ON members(club_id);
CREATE INDEX IF NOT EXISTS idx_events_club_id ON events(club_id);
CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON event_registrations(event_id);

-- Dados de exemplo (opcional - descomente para inserir dados de teste)
-- INSERT INTO clubs (name, category, description) VALUES
-- ('Clube de Programação', 'Tecnologia', 'Clube para entusiastas de programação e desenvolvimento'),
-- ('Clube de Xadrez', 'Estratégia', 'Aprenda e pratique xadrez com outros estudantes'),
-- ('Clube de Música', 'Arte', 'Para amantes da música e instrumentos');

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_clubs_updated_at BEFORE UPDATE ON clubs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Novas tabelas para autenticação e permissões
-- Tabela de Usuários (global, para auth)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Roles
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

-- Tabela de User Roles (relaciona usuários a roles, com club_id opcional para admin_club)
CREATE TABLE IF NOT EXISTS user_roles (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  role_id INT REFERENCES roles(id) ON DELETE CASCADE,
  club_id INT REFERENCES clubs(id) ON DELETE CASCADE NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Pedidos para Admin de Clube
CREATE TABLE IF NOT EXISTS requests_admin_club (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  club_id INT REFERENCES clubs(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'blocked')),
  attempts INT DEFAULT 1,
  last_attempt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Pedidos para Entrar em Clube
CREATE TABLE IF NOT EXISTS requests_join_club (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  club_id INT REFERENCES clubs(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para novas tabelas
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_club_id ON user_roles(club_id);
CREATE INDEX IF NOT EXISTS idx_requests_admin_club_user_club ON requests_admin_club(user_id, club_id);
CREATE INDEX IF NOT EXISTS idx_requests_join_club_user_club ON requests_join_club(user_id, club_id);

-- Inserir roles padrão
INSERT INTO roles (name) VALUES ('admin_system'), ('admin_club'), ('user') ON CONFLICT (name) DO NOTHING;