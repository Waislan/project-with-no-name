import pkg from 'pg';
const { Pool } = pkg;

export async function connectToDatabase(config = {}) {
    try {
        const pool = new Pool({
            connectionString: process.env.DB_URL,
            ssl: { rejectUnauthorized: false }
            // host: process.env.DB_HOST || 'localhost',
            // port: process.env.DB_PORT || 5432,
            // user: process.env.DB_USER || 'postgres',
            // password: process.env.DB_PASSWORD || 'postgres',
            // database: process.env.DB_DATABASE || 'minha_api',
            // max: 10,
            // idleTimeoutMillis: 30000,
            // ...config,
        });

        return pool;
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
        throw error;
    }
}
