const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.db');

// Remover banco existente se existir
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('🗑️  Banco de dados anterior removido');
}

console.log('🔄 Recriando banco de dados...');

// Executar init-db-sqlite
const { spawn } = require('child_process');

const initProcess = spawn('node', ['scripts/init-db-sqlite.js'], {
  stdio: 'inherit',
  cwd: path.join(__dirname, '..')
});

initProcess.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Banco recriado com sucesso!');
    console.log('🔄 Executando seed do admin...');

    // Executar seed-admin
    const seedProcess = spawn('node', ['scripts/seed-admin.js'], {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });

    seedProcess.on('close', (seedCode) => {
      if (seedCode === 0) {
        console.log('🎉 Setup completo! Banco resetado e admin criado.');
      } else {
        console.error('❌ Erro no seed do admin');
      }
    });
  } else {
    console.error('❌ Erro ao recriar banco');
  }
});