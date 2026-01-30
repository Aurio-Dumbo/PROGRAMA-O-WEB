// Configuração de conexão com o banco de dados MySQL
require('dotenv').config();
const mysql = require('mysql2/promise');

// Ecrio o pool de conexões com as credenciais do .env
const configBanco = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'atendimento_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

console.log('Conectando ao MySQL com:', {
  host: configBanco.host,
  user: configBanco.user,
  database: configBanco.database
});

const pool = mysql.createPool(configBanco);

pool.getConnection()
  .then(connection => {
    console.log(' Conectado ao MySQL com sucesso');
    connection.release();
  })
  .catch(error => {
    console.error('Erro ao conectar com o banco de dados:');
    console.error(`  ${error.message}`);
    console.error('  Verifique se MySQL está rodando e as credenciais estão corretas em backend/.env');
  });

module.exports = pool;
