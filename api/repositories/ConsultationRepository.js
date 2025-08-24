import IRepository from '../interfaces/IRepository.js';

export default class ConsultationRepository extends IRepository {
  constructor(db) {
    super();
    this.db = db;
  }

  async findAll() {
    try {
      const result = await this.db.query('SELECT * FROM consultations ORDER BY consultation_date DESC');
      return result.rows;
    } catch (error) {
      console.error('Error finding all consultations:', error);
      throw error;
    }
  }

  async findById(id) {
    try {
      const result = await this.db.query('SELECT * FROM consultations WHERE id = $1', [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding consultation by id:', error);
      throw error;
    }
  }

  async findByUserId(userId) {
    try {
      const result = await this.db.query(
        `SELECT c.*, p.name as patient_name, p.cpf as patient_cpf 
         FROM consultations c 
         JOIN patients p ON c.patient_id = p.id 
         WHERE c.user_id = $1 
         ORDER BY c.consultation_date DESC`,
        [userId]
      );
      return result.rows;
    } catch (error) {
      console.error('Error finding consultations by user_id:', error);
      throw error;
    }
  }

  async findByPatientId(userId, patientId) {
    try {
      const result = await this.db.query(
        'SELECT * FROM consultations WHERE user_id = $1 AND patient_id = $2 ORDER BY consultation_date DESC',
        [userId, patientId]
      );
      return result.rows;
    } catch (error) {
      console.error('Error finding consultations by patient_id:', error);
      throw error;
    }
  }

  async findByIdAndPatientId(userId, patientId, id) {
    try {
      const result = await this.db.query(
        'SELECT * FROM consultations WHERE id = $1 AND user_id = $2 AND patient_id = $3',
        [id, userId, patientId]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding consultation by id and patient_id:', error);
      throw error;
    }
  }

  async save(consultation) {
    try {
      const { user_id, patient_id, consultation_date, notes, report, transcription } = consultation;
      const result = await this.db.query(
        `INSERT INTO consultations (id, user_id, patient_id, consultation_date, notes, report, transcription, created_at, updated_at) 
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, now(), now()) 
         RETURNING *`,
        [user_id, patient_id, consultation_date || new Date(), notes, report, transcription]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error saving consultation:', error);
      throw error;
    }
  }

  async update(id, consultationData) {
    try {
      const { consultation_date, notes, report, transcription } = consultationData;
      const result = await this.db.query(
        `UPDATE consultations 
         SET consultation_date = COALESCE($1, consultation_date),
             notes = COALESCE($2, notes),
             report = COALESCE($3, report),
             transcription = COALESCE($4, transcription),
             updated_at = now()
         WHERE id = $5 
         RETURNING *`,
        [consultation_date, notes, report, transcription, id]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error updating consultation:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const result = await this.db.query(
        'DELETE FROM consultations WHERE id = $1 RETURNING *',
        [id]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error deleting consultation:', error);
      throw error;
    }
  }
}
