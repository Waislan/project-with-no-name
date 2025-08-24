import IController from '../interfaces/IController.js';

export default class ConsultationController extends IController {
  constructor(consultationService) {
    super();
    this.consultationService = consultationService;
  }

  async getAll(req, res) {
    try {
      const consultations = await this.consultationService.getAll();
      res.json(consultations);
    } catch (error) {
      console.error('Error getting all consultations:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const consultation = await this.consultationService.getById(id);
      
      if (!consultation) {
        return res.status(404).json({ error: 'Consultation not found' });
      }
      
      res.json(consultation);
    } catch (error) {
      console.error('Error getting consultation by id:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getByUserId(req, res) {
    try {
      const { userId } = req.params;
      const consultations = await this.consultationService.getByUserId(userId);
      res.json(consultations);
    } catch (error) {
      console.error('Error getting consultations by user_id:', error);
      
      if (error.message.includes('required')) {
        return res.status(400).json({ error: error.message });
      }
      
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getByPatientId(req, res) {
    try {
      const { userId, patientId } = req.params;
      const consultations = await this.consultationService.getByPatientId(userId, patientId);
      res.json(consultations);
    } catch (error) {
      console.error('Error getting consultations by patient_id:', error);
      
      if (error.message.includes('required') || error.message.includes('not found') || error.message.includes('does not belong')) {
        return res.status(400).json({ error: error.message });
      }
      
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getByIdAndPatientId(req, res) {
    try {
      const { userId, patientId, id } = req.params;
      const consultation = await this.consultationService.getByIdAndPatientId(userId, patientId, id);
      
      if (!consultation) {
        return res.status(404).json({ error: 'Consultation not found' });
      }
      
      res.json(consultation);
    } catch (error) {
      console.error('Error getting consultation by id and patient_id:', error);
      
      if (error.message.includes('required') || error.message.includes('not found') || error.message.includes('does not belong')) {
        return res.status(400).json({ error: error.message });
      }
      
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async create(req, res) {
    try {
      const { userId, patientId } = req.params;
      const consultationData = { 
        ...req.body, 
        user_id: userId, 
        patient_id: patientId 
      };
      
      const newConsultation = await this.consultationService.create(consultationData);
      res.status(201).json(newConsultation);
    } catch (error) {
      console.error('Error creating consultation:', error);
      
      if (error.message.includes('required') || error.message.includes('not found') || error.message.includes('does not belong')) {
        return res.status(400).json({ error: error.message });
      }
      
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async update(req, res) {
    try {
      const { userId, patientId, id } = req.params;
      const consultationData = req.body;
      
      // Verify consultation exists and belongs to user/patient
      const existingConsultation = await this.consultationService.getByIdAndPatientId(userId, patientId, id);
      if (!existingConsultation) {
        return res.status(404).json({ error: 'Consultation not found' });
      }
      
      const updatedConsultation = await this.consultationService.update(id, consultationData);
      res.json(updatedConsultation);
    } catch (error) {
      console.error('Error updating consultation:', error);
      
      if (error.message.includes('required') || error.message.includes('not found') || error.message.includes('does not belong')) {
        return res.status(400).json({ error: error.message });
      }
      
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async delete(req, res) {
    try {
      const { userId, patientId, id } = req.params;
      
      // Verify consultation exists and belongs to user/patient
      const existingConsultation = await this.consultationService.getByIdAndPatientId(userId, patientId, id);
      if (!existingConsultation) {
        return res.status(404).json({ error: 'Consultation not found' });
      }
      
      const deletedConsultation = await this.consultationService.delete(id);
      res.json({ message: 'Consultation deleted successfully', consultation: deletedConsultation });
    } catch (error) {
      console.error('Error deleting consultation:', error);
      
      if (error.message.includes('required') || error.message.includes('not found') || error.message.includes('does not belong')) {
        return res.status(400).json({ error: error.message });
      }
      
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
