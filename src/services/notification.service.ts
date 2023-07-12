import cron from 'node-cron';
import { logger } from '@utils/logger';
import { Todo } from '@interfaces/todos.interface';
// import { TodoModel } from '@models/todos.model';
// import {TodosController} from "@controllers/todos.controller";
import {Container} from "typedi";
import {TodoService} from "@services/todos.service";

export class NotifyService {
  private static instance: NotifyService;
  private task: cron.ScheduledTask;
  private lastTimestamp: Date;
  private timers: Map<string, { timestamp: string; timer: NodeJS.Timeout }>;
  private todo = Container.get(TodoService);
  private constructor() {
    this.timers = new Map();
  }

  static getInstance(): NotifyService {
    if (!this.instance) {
      this.instance = new NotifyService();
    }
    return this.instance;
  }
  private async queryForNotification() {
    const lastTimestamp = new Date();
    const minDate = new Date(lastTimestamp.getTime());
    minDate.setMinutes(lastTimestamp.getMinutes() - 60, 0, 0);

    const maxDate = new Date(lastTimestamp.getTime()); //.setMinutes().setSeconds(59, 999);
    maxDate.setMinutes(lastTimestamp.getMinutes() + 1, 59, 999);

    const filter = {
      notify: {
        $gte: minDate,
        $lte: maxDate,
      },
      sendNotify: {
        $ne: true,
      },
    };
    logger.info(`queryForNotification`, filter);

    const todos: Todo[] =await this.todo.findAllTodo(filter)
    // const todos: Todo[] = await TodoModel.find(filter);
    logger.info(`queryForNotification`, { filter, todos });
    return todos;
  }

  private setTimeoutTriggers(todos: Todo[]) {
    for (const todo of todos) {
      this.setTimeoutTrigger(todo);
    }
  }

  public deleteTimerById(id: string) {
    if (this.timers.has(id)) {
      const timerSetting = this.timers.get(id);
      clearTimeout(timerSetting.timer);
      this.timers.delete(id);
      return true;
    }
    return false;
  }

  private setTimeoutTrigger(todo: Todo) {
    const { _id } = todo;
    const id = _id.toString();

    if (this.timers.has(id)) {
      const timerSetting = this.timers.get(id);
      // only if notify time changed setTimer
      if (timerSetting.timestamp !== todo.notify) {
        this.deleteTimerById(id);
      } else {
        return;
      }
    }

    const currentTime = Date.now();
    const notificationTime = new Date(todo.notify).getTime();
    const milliSecToExecute = notificationTime - currentTime;
    const timer = setTimeout(async () => {
      await this.sendNotification(todo);
    }, milliSecToExecute);
    this.timers.set(id, { timestamp: todo.notify, timer });
  }
  public start() {
    if (!this?.task) {
      // TODO: load already set timers for notification to support server restart
      logger.info(`NotifyManager: start`);
      this.task = cron.schedule(
        '*/1 * * * *', // At every 1th minute
        async () => {
          try {
            logger.info(`NotifyManager: schedule job start`);
            const todos = await this.queryForNotification();
            this.setTimeoutTriggers(todos);
            logger.info(`NotifyManager: schedule job stop`);
          } catch (err) {
            logger.error(`NotifyManager: ${err?.message}`);
          }
        },
      );
    }
  }

  public stop() {
    if (this?.task) {
      logger.info(`NotifyManager: stop`);
      this.task.stop();
    }
  }

  private async sendNotification(todo: Todo) {
    const id = todo._id.toString();
    logger.info(`sendNotification ${id}`, todo.toString());
    // TODO: send notification to user;
    const updateTodoById: Todo = await this.todo.updateTodo(id, {note: todo.note, notify: todo.notify, sendNotify: true});
    // const updateTodoById: Todo = await TodoModel.findByIdAndUpdate(id, { sendNotify: true }, { new: true });
    this.deleteTimerById(id);
    logger.info(`sendNotification ${id}`, updateTodoById.toString());
  }
}
