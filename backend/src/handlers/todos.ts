import { Request, ResponseToolkit } from '@hapi/hapi';
import Boom from '@hapi/boom';

export type Todo = {
  id: string;
  name: string;
  done: boolean;
};

const todoStore: { [id: string] : Todo } = {};

export function update(req: Request, h: ResponseToolkit) {
  req.log('info', `${req.method} ${req.info.host}${req.path}`);
  const todoID = req.params.todoID;
  if (!todoID) return Boom.badRequest('todoID parameter required');
  try {
    todoStore[todoID] = (req.payload as Todo);
    return h.response().code(200);
  } catch (error) {
    return Boom.badRequest('invalid todo format');
  }
}

export function list(req: Request, h: ResponseToolkit) {
  req.log('info', `${req.method} ${req.info.host}${req.path}`);
  const todoList = [];
  for (const todoID in todoStore) {
    todoList.push(todoStore[todoID]);
  }
  return h.response({todoList: todoList}).code(200);
}
