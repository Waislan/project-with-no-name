import IService from '../interfaces/IService.js';

export default class ConsultationService extends IService {
  constructor(consultationRepository, patientService) {
    super(consultationRepository);
    this.patientService = patientService;
  }

  async getAll() {
    return await this.repository.findAll();
  }

  async getById(id) {
    return await this.repository.findById(id);
  }

  async getByUserId(userId) {
    if (!userId) {
      throw new Error('User ID is required');
    }
    return await this.repository.findByUserId(userId);
  }

  async getByPatientId(userId, patientId) {
    if (!userId) {
      throw new Error('User ID is required');
    }
    if (!patientId) {
      throw new Error('Patient ID is required');
    }

    // Validate that patient belongs to user
    await this.validatePatientOwnership(userId, patientId);
    
    return await this.repository.findByPatientId(userId, patientId);
  }

  async getByIdAndPatientId(userId, patientId, id) {
    if (!userId) {
      throw new Error('User ID is required');
    }
    if (!patientId) {
      throw new Error('Patient ID is required');
    }
    if (!id) {
      throw new Error('Consultation ID is required');
    }

    // Validate that patient belongs to user
    await this.validatePatientOwnership(userId, patientId);
    
    return await this.repository.findByIdAndPatientId(userId, patientId, id);
  }

  async create(consultationData) {
    const { user_id, patient_id } = consultationData;
    
    if (!user_id) {
      throw new Error('User ID is required');
    }
    if (!patient_id) {
      throw new Error('Patient ID is required');
    }

    // Validate that patient belongs to user
    await this.validatePatientOwnership(user_id, patient_id);
    
    return await this.repository.save(consultationData);
  }

  async update(id, consultationData) {
    if (!id) {
      throw new Error('Consultation ID is required');
    }

    const updatedConsultation = await this.repository.update(id, consultationData);
    if (!updatedConsultation) {
      throw new Error('Consultation not found');
    }
    return updatedConsultation;
  }

  async delete(id) {
    if (!id) {
      throw new Error('Consultation ID is required');
    }

    const deletedConsultation = await this.repository.delete(id);
    if (!deletedConsultation) {
      throw new Error('Consultation not found');
    }
    return deletedConsultation;
  }

  async validatePatientOwnership(userId, patientId) {
    const patient = await this.patientService.getByIdAndUserId(patientId, userId);
    if (!patient) {
      throw new Error('Patient not found or does not belong to user');
    }
    return patient;
  }
}
