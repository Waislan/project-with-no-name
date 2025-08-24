import IRepository from '../interfaces/IRepository.js';

export default class UserRepository extends IRepository {
  constructor(db) {
    super();
    this.db = db;
  }

  async findAll() {
    try {
      // Buscar todos os usuários com suas informações completas
      const result = await this.db.query(`
        SELECT 
          au.id,
          au.email,
          COALESCE(up.name, au.email) as name,
          au.created_at,
          au.updated_at
        FROM auth.users au
        LEFT JOIN user_profiles up ON au.id = up.user_id
        WHERE au.deleted_at IS NULL
        ORDER BY COALESCE(up.name, au.email)
      `);
      return result.rows;
    } catch (error) {
      console.error('Error finding all users:', error);
      throw error;
    }
  }

  async findById(id) {
    try {
      // Buscar usuário específico com todas as informações
      const result = await this.db.query(`
        SELECT 
          au.id,
          au.email,
          COALESCE(up.name, au.email) as name,
          au.created_at,
          au.updated_at
        FROM auth.users au
        LEFT JOIN user_profiles up ON au.id = up.user_id
        WHERE au.id = $1 AND au.deleted_at IS NULL
      `, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding user by id:', error);
      throw error;
    }
  }

  async save(userData) {
    try {
      // Para criação de usuário, recebemos email e name
      const { email, name } = userData;
      
      // Verificar se o email já está cadastrado no Supabase Auth
      const existingUser = await this.db.query(
        'SELECT id FROM auth.users WHERE email = $1 AND deleted_at IS NULL',
        [email]
      );

      if (existingUser.rows.length > 0) {
        throw new Error('Email already exists');
      }

      // Criar novo usuário no Supabase Auth (simulado)
      // Em um cenário real, isso seria feito pelo próprio Supabase
      const newUserId = 'generated-uuid'; // Placeholder para o ID gerado
      
      // Criar perfil para o novo usuário
      const result = await this.db.query(
        'INSERT INTO user_profiles (user_id, name) VALUES ($1, $2) RETURNING *',
        [newUserId, name]
      );
      
      return result.rows[0];
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  }

  async update(id, userData) {
    try {
      // Para usuários do Supabase Auth, apenas atualizamos o perfil
      const { name } = userData;
      
      if (!name) {
        throw new Error('Name is required for user profile update');
      }

      const result = await this.db.query(
        'UPDATE user_profiles SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 RETURNING *',
        [name, id]
      );
      
      if (result.rows.length === 0) {
        // Se não existe perfil, criar um
        return await this.save({ user_id: id, name });
      }
      
      return result.rows[0];
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      // Para usuários do Supabase Auth, apenas removemos o perfil
      // O usuário em si é gerenciado pelo Supabase
      const result = await this.db.query(
        'DELETE FROM user_profiles WHERE user_id = $1 RETURNING *',
        [id]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error deleting user profile:', error);
      throw error;
    }
  }
}
