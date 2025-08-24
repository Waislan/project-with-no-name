import IRepository from '../interfaces/IRepository.js';

export default class PatientRepository extends IRepository {
  constructor(db) {
    super();
    this.db = db;
  }

  async findAll() {
    try {
      const result = await this.db.query('SELECT * FROM patients ORDER BY name');
      return result.rows;
    } catch (error) {
      console.error('Error finding all patients:', error);
      throw error;
    }
  }

  async findById(id) {
    try {
      const result = await this.db.query('SELECT * FROM patients WHERE id = $1', [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding patient by id:', error);
      throw error;
    }
  }

  async findByUserId(userId) {
    try {
      const result = await this.db.query('SELECT * FROM patients WHERE user_id = $1 ORDER BY name', [userId]);
      return result.rows;
    } catch (error) {
      console.error('Error finding patients by user_id:', error);
      throw error;
    }
  }

  async findByIdAndUserId(id, userId) {
    try {
      const result = await this.db.query('SELECT * FROM patients WHERE id = $1 AND user_id = $2', [id, userId]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding patient by id and user_id:', error);
      throw error;
    }
  }

  async save(patient) {
    try {
      const { name, cpf, user_id } = patient;
      const result = await this.db.query(
        'INSERT INTO patients (id, user_id, name, cpf) VALUES (gen_random_uuid(), $1, $2, $3) RETURNING *',
        [user_id, name, cpf]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error saving patient:', error);
      throw error;
    }
  }

  async update(id, patientData) {
    try {
      const { name, cpf } = patientData;
      const result = await this.db.query(
        'UPDATE patients SET name = $1, cpf = $2 WHERE id = $3 RETURNING *',
        [name, cpf, id]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error updating patient:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const result = await this.db.query(
        'DELETE FROM patients WHERE id = $1 RETURNING *',
        [id]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error deleting patient:', error);
      throw error;
    }
  }
}
