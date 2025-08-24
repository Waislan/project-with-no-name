import { Router } from 'express';
import PatientFactory from '../factories/PatientFactory.js';

export default function registerPatientRoutes(app, db) {
  const controller = PatientFactory.build(db);
  
  app.get('/users/:userId/patients', controller.getByUserId.bind(controller));
  app.post('/users/:userId/patients', controller.create.bind(controller));
  app.get('/users/:userId/patients/:id', controller.getByIdAndUserId.bind(controller));
  app.put('/users/:userId/patients/:id', controller.update.bind(controller));
  app.delete('/users/:userId/patients/:id', controller.delete.bind(controller));
}
