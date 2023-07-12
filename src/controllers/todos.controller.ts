import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { TodoService } from '@services/todos.service';
import { Todo } from '@interfaces/todos.interface';
import {NotifyService} from "@services/notification.service";

export class TodosController {
  public todo = Container.get(TodoService);

  public deleteTodo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {id: todoId} = req.params;
      const status = NotifyService.getInstance().deleteTimerById(todoId);

      res.status(200).json({data: status, message: 'deleted'});
    } catch (error) {
      next(error);
    }
  };
}
