const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

const schema = `
-- Sistema de Gestão de Clubes - SQLite Schema

-- Tabela de Clubes
CREATE TABLE IF NOT EXISTS clubs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255) NOT NULL UNIQUE,
  category VARCHAR(100) DEFAULT 'Geral',
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Membros
CREATE TABLE IF NOT EXISTS members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  club_id INTEGER REFERENCES clubs(id) ON DELETE CASCADE,
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(email, club_id)
);

-- Tabela de Eventos
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  club_id INTEGER REFERENCES clubs(id) ON DELETE CASCADE,
  event_date DATETIME NOT NULL,
  location VARCHAR(255),
  max_participants INTEGER DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Inscrições em Eventos
CREATE TABLE IF NOT EXISTS event_registrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  member_id INTEGER REFERENCES members(id) ON DELETE CASCADE,
  registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(event_id, member_id)
);

-- Novos usuários para auth
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Roles
CREATE TABLE IF NOT EXISTS roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(50) UNIQUE NOT NULL
);

-- Tabela de User Roles
CREATE TABLE IF NOT EXISTS user_roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
  club_id INTEGER REFERENCES clubs(id) ON DELETE CASCADE,
  assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Pedidos para Admin de Clube
CREATE TABLE IF NOT EXISTS requests_admin_club (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  club_id INTEGER REFERENCES clubs(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending',
  attempts INTEGER DEFAULT 1,
  last_attempt DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Pedidos para Entrar em Clube
CREATE TABLE IF NOT EXISTS requests_join_club (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  club_id INTEGER REFERENCES clubs(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_clubs_category ON clubs(category);
CREATE INDEX IF NOT EXISTS idx_members_club_id ON members(club_id);
CREATE INDEX IF NOT EXISTS idx_events_club_id ON events(club_id);
CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_club_id ON user_roles(club_id);
CREATE INDEX IF NOT EXISTS idx_requests_admin_club_user_club ON requests_admin_club(user_id, club_id);
CREATE INDEX IF NOT EXISTS idx_requests_join_club_user_club ON requests_join_club(user_id, club_id);

-- Inserir roles padrão
INSERT OR IGNORE INTO roles (name) VALUES ('admin_system'), ('admin_club'), ('user');
`;

try {
  db.exec(schema);
  console.log('Database initialized successfully with SQLite!');
} catch (err) {
  console.error('Error initializing database:', err);
} finally {
  db.close();
}