import { Service } from 'typedi';
import { HttpException } from '@exceptions/httpException';
import { Todo } from '@interfaces/todos.interface';
import { TodoModel } from '@models/todos.model';

@Service()
export class TodoService {
  public async findAllTodo(filters: any): Promise<Todo[]> {
    const todos: Todo[] = await TodoModel.find(filters);
    return todos;
  }

  public async updateTodo(todoId: string, todoData: Todo): Promise<Todo> {
    const update = todoData;
    if (!todoData?.notify) {
      update['$unset'] = { notify: 1 };
    }
    const updateTodoById: Todo = await TodoModel.findByIdAndUpdate(todoId, update, { new: true });
    if (!updateTodoById) throw new HttpException(409, "Todo doesn't exist");

    return updateTodoById;
  }

  public async deleteTodo(todoId: string): Promise<Todo> {
    const deleteTodoById: Todo = await TodoModel.findByIdAndDelete(todoId);
    if (!deleteTodoById) throw new HttpException(409, "Todo doesn't exist");

    return deleteTodoById;
  }
}
