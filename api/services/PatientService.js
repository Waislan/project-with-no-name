import IService from '../interfaces/IService.js';

export default class PatientService extends IService {
  constructor(patientRepository) {
    super(patientRepository);
  }

  async getAll() {
    return await this.repository.findAll();
  }

  async getById(id) {
    return await this.repository.findById(id);
  }

  async getByUserId(userId) {
    return await this.repository.findByUserId(userId);
  }

  async getByIdAndUserId(id, userId) {
    return await this.repository.findByIdAndUserId(id, userId);
  }

  async create(patientData) {
    return await this.repository.save(patientData);
  }

  async update(id, patientData) {
    const updatedPatient = await this.repository.update(id, patientData);
    if (!updatedPatient) {
      throw new Error('Patient not found');
    }
    return updatedPatient;
  }

  async delete(id) {
    const deletedPatient = await this.repository.delete(id);
    if (!deletedPatient) {
      throw new Error('Patient not found');
    }
    return deletedPatient;
  }
}
