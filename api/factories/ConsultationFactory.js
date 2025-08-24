import ConsultationController from '../controllers/ConsultationController.js';
import ConsultationService from '../services/ConsultationService.js';
import ConsultationRepository from '../repositories/ConsultationRepository.js';
import PatientFactory from './PatientFactory.js';

export default class ConsultationFactory {
  static build(db) {
    const consultationRepository = new ConsultationRepository(db);
    
    // Build patient controller to get patient service for validation
    const patientController = PatientFactory.build(db);
    const patientService = patientController.patientService;
    
    const consultationService = new ConsultationService(consultationRepository, patientService);
    const consultationController = new ConsultationController(consultationService);
    
    return consultationController;
  }
}
