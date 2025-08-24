import { Router } from 'express';
import UserFactory from '../factories/UserFactory.js';

export default function registerUserRoutes(app, db) {
  const controller = UserFactory.build(db);
  const router = Router();

  router.get('/', controller.getAll.bind(controller));
  router.get('/:id', controller.getById.bind(controller));
  router.post('/', controller.create.bind(controller));
  router.put('/:id', controller.update.bind(controller));
  router.delete('/:id', controller.delete.bind(controller));

  app.use('/users', router);
}
