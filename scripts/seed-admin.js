const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config();

const dbPath = path.join(__dirname, '..', 'database.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

async function seedAdmin() {
  try {
    // Obter dados do admin das variáveis de ambiente
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@sistema.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminName = process.env.ADMIN_NAME || 'Administrador Sistema';

    // Verificar se já existe um admin do sistema
    const existingAdmin = db.prepare(`
      SELECT u.id FROM users u
      JOIN user_roles ur ON u.id = ur.user_id
      JOIN roles r ON ur.role_id = r.id
      WHERE r.name = 'admin_system'
    `).get();

    if (existingAdmin) {
      console.log('Admin do sistema já existe!');
      return;
    }

    // Criar hash da senha
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Inserir usuário admin
    const insertUser = db.prepare(`
      INSERT INTO users (email, password_hash, name)
      VALUES (?, ?, ?)
    `);

    const result = insertUser.run(adminEmail, hashedPassword, adminName);

    // Obter ID do role admin_system
    const roleResult = db.prepare('SELECT id FROM roles WHERE name = ?').get('admin_system');
    if (!roleResult) {
      throw new Error('Role admin_system não encontrada');
    }

    // Atribuir role de admin do sistema
    const insertRole = db.prepare(`
      INSERT INTO user_roles (user_id, role_id, club_id)
      VALUES (?, ?, NULL)
    `);

    insertRole.run(result.lastInsertRowid, roleResult.id);

    console.log('✅ Admin do sistema criado com sucesso!');
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Senha: ${adminPassword}`);
    console.log('⚠️  IMPORTANTE: Altere a senha após o primeiro login!');

  } catch (error) {
    console.error('Erro ao criar admin:', error);
  } finally {
    db.close();
  }
}

seedAdmin();