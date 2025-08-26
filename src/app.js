import express from 'express';
import cors from 'cors';

export default class App {
    constructor(db, routes = []) {
        this.db = db;
        this.routes = routes;
        this.express = express();
    }

    async setup() {
        // Configuração do CORS
        this.express.use(cors({
            origin: [
                'http://localhost:3001',           // Desenvolvimento local (porta anterior)
                'http://localhost:4000',           // Desenvolvimento local (nova porta)
                'https://nutria-nine.vercel.app'   // Produção no Vercel
            ],
            credentials: true,                     // Permite cookies e headers de autenticação
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos HTTP permitidos
            allowedHeaders: ['Content-Type', 'Authorization']     // Headers permitidos
        }));
        
        this.express.use(express.json());
        this.registerRoutes();  
    }

    registerRoutes() {
        this.routes.forEach((register) => register(this.express, this.db));
    }

    getInstance() {
        return this.express;
    }
}
