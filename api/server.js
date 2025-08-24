
import App from './app.js';
import { connectToDatabase } from './database/db.js';
import registerUserRoutes from './routes/UserRoutes.js';
import registerPatientRoutes from './routes/PatientRoutes.js';
import registerConsultationRoutes from './routes/ConsultationRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

// Função para inicializar a aplicação
const initializeApp = async () => {
    const db = await connectToDatabase();
    console.log('Connected to database!');

    const appInstance = new App(db, [registerUserRoutes, registerPatientRoutes, registerConsultationRoutes]);
    await appInstance.setup();

    return appInstance.getInstance();
};

// Para desenvolvimento local
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    
    initializeApp().then(app => {
        app.listen(PORT, () => {
            console.log(`Servidor rodando em http://localhost:${PORT}`);
        });
    });
}

// Para Vercel - exporta a aplicação
export default initializeApp;
