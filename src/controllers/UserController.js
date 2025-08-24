import IController from '../interfaces/IController.js';

export default class UserController extends IController {
  constructor(userService) {
    super();
    this.userService = userService;
  }

  async getAll(req, res) {
    try {
      const users = await this.userService.getAll();
      res.json(users);
    } catch (error) {
      console.error('Error getting all users:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const user = await this.userService.getById(id);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json(user);
    } catch (error) {
      console.error('Error getting user by id:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async create(req, res) {
    try {
      const userData = req.body;
      const newUser = await this.userService.create(userData);
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      
      if (error.message.includes('Email already exists')) {
        return res.status(409).json({ error: error.message });
      }
      
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const userData = req.body;
      const updatedUser = await this.userService.update(id, userData);
      
      if (!updatedUser) {
        return res.status(404).json({ error: 'User profile not found' });
      }
      
      res.json(updatedUser);
    } catch (error) {
      console.error('Error updating user profile:', error);
      
      if (error.message.includes('required')) {
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
      const { id } = req.params;
      const deletedUser = await this.userService.delete(id);
      
      if (!deletedUser) {
        return res.status(404).json({ error: 'User profile not found' });
      }
      
      res.json({ message: 'User profile deleted successfully', user: deletedUser });
    } catch (error) {
      console.error('Error deleting user profile:', error);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({ error: error.message });
      }
      
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
