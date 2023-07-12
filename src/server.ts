import { App } from '@/app';
import { ValidateEnv } from '@utils/validateEnv';
import { NotifyService } from '@services/notification.service';
import {TodoRoute} from "@routes/todos.route";

ValidateEnv();

(() => {
  const app = new App([new TodoRoute()]);
  app.listen();
  const notifyService = NotifyService.getInstance();
  notifyService.start();
})();

process.on('exit', () => {
  console.log('exit');
});
