import express from 'express';
import { createServer } from '@vercel/node';
import { connectToDatabase } from './database/db.js';
import registerUserRoutes from './routes/UserRoutes.js';
import registerPatientRoutes from './routes/PatientRoutes.js';
//import registerConsultationRoutes from './routes/ConsultationRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

// Cache da aplicação para reutilização
let app = null;

export default async function handler(req, res) {
    // Inicializa a aplicação apenas uma vez
    if (!app) {
        try {
            // Usa DATABASE_URL para compatibilidade com Vercel
            const db = await connectToDatabase();
            console.log('Connected to database!');

            const expressApp = express();
            
            // Middleware para CORS
            expressApp.use((req, res, next) => {
                res.header('Access-Control-Allow-Origin', '*');
                res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
                res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
                
                if (req.method === 'OPTIONS') {
                    res.sendStatus(200);
                } else {
                    next();
                }
            });
            
            expressApp.use(express.json());

            // Registra todas as rotas
            registerUserRoutes(expressApp, db);
            registerPatientRoutes(expressApp, db);
            //registerConsultationRoutes(expressApp, db);

            // Middleware de tratamento de erros
            expressApp.use((err, req, res, next) => {
                console.error('Error:', err);
                res.status(500).json({ error: 'Internal server error' });
            });

            // Middleware para rotas não encontradas
            expressApp.use('*', (req, res) => {
                res.status(404).json({ error: 'Route not found' });
            });

            app = expressApp;
        } catch (error) {
            console.error('Error initializing app:', error);
            return res.status(500).json({ error: 'Failed to initialize application' });
        }
    }

    // Delega a requisição para o Express
    return createServer(app);
}
