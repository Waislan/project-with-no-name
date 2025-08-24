
import App from './app.js';
import { connectToDatabase } from './database/db.js';
import registerUserRoutes from './routes/UserRoutes.js';
import registerPatientRoutes from './routes/PatientRoutes.js';
import registerConsultationRoutes from './routes/ConsultationRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

const main = async () => {
    const db = await connectToDatabase();
    console.log('Connected to database!') 

    const appInstance = new App(db, [registerUserRoutes, registerPatientRoutes, registerConsultationRoutes]);
    await appInstance.setup();

    const app = appInstance.getInstance();

    app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
}
main();
