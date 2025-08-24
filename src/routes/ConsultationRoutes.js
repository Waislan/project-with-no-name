import { Router } from 'express';
import ConsultationFactory from '../factories/ConsultationFactory.js';

export default function registerConsultationRoutes(app, db) {
  const controller = ConsultationFactory.build(db);
  
  // Consultations of a User (without patient filter)
  app.get('/users/:userId/consultations', controller.getByUserId.bind(controller));
  
  // Consultations of a Patient (nested in Users and Patients)
  app.get('/users/:userId/patients/:patientId/consultations', controller.getByPatientId.bind(controller));
  app.post('/users/:userId/patients/:patientId/consultations', controller.create.bind(controller));
  app.get('/users/:userId/patients/:patientId/consultations/:id', controller.getByIdAndPatientId.bind(controller));
  app.put('/users/:userId/patients/:patientId/consultations/:id', controller.update.bind(controller));
  app.delete('/users/:userId/patients/:patientId/consultations/:id', controller.delete.bind(controller));
}
