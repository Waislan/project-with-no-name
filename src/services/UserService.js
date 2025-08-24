import IService from '../interfaces/IService.js';

export default class UserService extends IService {
  constructor(userRepository) {
    super(userRepository);
  }

  async getAll() {
    return await this.repository.findAll();
  }

  async getById(id) {
    return await this.repository.findById(id);
  }

  async create(userData) {
    return await this.repository.save(userData);
  }

  async update(id, userData) {
    const updatedUser = await this.repository.update(id, userData);
    if (!updatedUser) {
      throw new Error('User profile not found');
    }
    return updatedUser;
  }

  async delete(id) {
    const deletedUser = await this.repository.delete(id);
    if (!deletedUser) {
      throw new Error('User profile not found');
    }
    return deletedUser;
  }
}
