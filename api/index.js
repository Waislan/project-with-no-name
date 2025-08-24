import express from 'express';

// Cache da aplicação para reutilização
let app = null;

export default async function handler(req, res) {
    // Inicializa a aplicação apenas uma vez
    if (!app) {
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

        // Rota de teste
        expressApp.get('/', (req, res) => {
            res.json({ message: 'API is running on Vercel!' });
        });

        // Rota de health check
        expressApp.get('/health', (req, res) => {
            res.json({ status: 'OK', timestamp: new Date().toISOString() });
        });

        // Middleware para rotas não encontradas
        expressApp.use('*', (req, res) => {
            res.status(404).json({ error: 'Route not found', path: req.originalUrl });
        });

        app = expressApp;
    }

    // Delega a requisição para o Express
    return app(req, res);
}
