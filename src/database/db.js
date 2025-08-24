import pkg from 'pg';
const { Pool } = pkg;

export async function connectToDatabase(config = {}) {
    try {
        const pool = new Pool({
            //connectionString: process.env.DB_URL,
            ssl: { rejectUnauthorized: false },
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
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
