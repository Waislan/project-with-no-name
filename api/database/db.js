import pkg from 'pg';
const { Pool } = pkg;

export async function connectToDatabase(config = {}) {
    try {
        // Usa DATABASE_URL para compatibilidade com Vercel, com fallback para DB_URL
        const connectionString = process.env.DATABASE_URL || process.env.DB_URL;
        
        if (!connectionString) {
            throw new Error('DATABASE_URL or DB_URL environment variable is required');
        }

        const pool = new Pool({
            connectionString: connectionString,
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
