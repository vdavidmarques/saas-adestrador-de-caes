import mysql, { Pool } from 'mysql2/promise';

// Criamos o Pool com a tipagem explícita da interface Pool do mysql2
const pool: Pool = mysql.createPool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'rootpassword',
  database: process.env.DB_NAME || 'adestramento_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Exportação no padrão ES Modules/TypeScript (em substituição ao module.exports)
export default pool;