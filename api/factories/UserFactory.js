import UserRepository from '../repositories/UserRepository.js';
import UserService from '../services/UserService.js';
import UserController from '../controllers/UserController.js';

export default class UserFactory {
  static build(db) {
    const userRepository = new UserRepository(db);
    const userService = new UserService(userRepository);
    const userController = new UserController(userService);
    
    return userController;
  }
}
