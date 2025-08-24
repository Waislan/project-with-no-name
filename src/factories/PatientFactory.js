import PatientController from '../controllers/PatientController.js';
import PatientService from '../services/PatientService.js';
import PatientRepository from '../repositories/PatientRepository.js';

export default class PatientFactory {
  static build(db) {
    const repository = new PatientRepository(db);
    const service = new PatientService(repository);
    const controller = new PatientController(service);
    return controller;
  }
}
