import IController from '../interfaces/IController.js';

export default class PatientController extends IController {
  constructor(patientService) {
    super();
    this.patientService = patientService;
  }

  async getAll(req, res) {
    try {
      const patients = await this.patientService.getAll();
      res.json(patients);
    } catch (error) {
      console.error('Error getting all patients:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const patient = await this.patientService.getById(id);
      
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      
      res.json(patient);
    } catch (error) {
      console.error('Error getting patient by id:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getByUserId(req, res) {
    try {
      const { userId } = req.params;
      const patients = await this.patientService.getByUserId(userId);
      res.json(patients);
    } catch (error) {
      console.error('Error getting patients by user_id:', error);
      
      if (error.message.includes('required')) {
        return res.status(400).json({ error: error.message });
      }
      
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getByIdAndUserId(req, res) {
    try {
      const { userId, id } = req.params;
      const patient = await this.patientService.getByIdAndUserId(id, userId);
      
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      
      res.json(patient);
    } catch (error) {
      console.error('Error getting patient by id and user_id:', error);
      
      if (error.message.includes('required')) {
        return res.status(400).json({ error: error.message });
      }
      
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async create(req, res) {
    try {
      const { userId } = req.params;
      const patientData = { ...req.body, user_id: userId };
      const newPatient = await this.patientService.create(patientData);
      res.status(201).json(newPatient);
    } catch (error) {
      console.error('Error creating patient:', error);
      
      if (error.message.includes('required') || error.message.includes('Invalid')) {
        return res.status(400).json({ error: error.message });
      }
      
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async update(req, res) {
    try {
      const { userId, id } = req.params;
      const patientData = req.body;
      
      // Verify patient belongs to user
      const existingPatient = await this.patientService.getByIdAndUserId(id, userId);
      if (!existingPatient) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      
      const updatedPatient = await this.patientService.update(id, patientData);
      res.json(updatedPatient);
    } catch (error) {
      console.error('Error updating patient:', error);
      
      if (error.message.includes('required') || error.message.includes('Invalid')) {
        return res.status(400).json({ error: error.message });
      }
      
      if (error.message.includes('not found')) {
        return res.status(404).json({ error: error.message });
      }
      
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async delete(req, res) {
    try {
      const { userId, id } = req.params;
      
      // Verify patient belongs to user
      const existingPatient = await this.patientService.getByIdAndUserId(id, userId);
      if (!existingPatient) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      
      const deletedPatient = await this.patientService.delete(id);
      res.json({ message: 'Patient deleted successfully', patient: deletedPatient });
    } catch (error) {
      console.error('Error deleting patient:', error);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({ error: error.message });
      }
      
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
