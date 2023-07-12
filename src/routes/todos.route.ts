import { Router } from 'express';
import { TodosController } from '@controllers/todos.controller';
import {Routes} from "@interfaces/interfaces/routes.interface";

export class TodoRoute implements Routes {
  public path = '/todos';
  public router = Router();
  public todo = new TodosController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.delete(`${this.path}/:id`, this.todo.deleteTodo);
  }
}
