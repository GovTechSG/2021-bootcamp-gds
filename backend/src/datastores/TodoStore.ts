import { Todo } from "types/Todo";

const todoList: { [id: string]: Todo } = {};

export function add(newTodo: Todo) {
  todoList[newTodo.id] = newTodo;
}

export function getAll(): { [id: string]: Todo } {
  return todoList;
}

export function getById(id: string) {
  if (id in todoList) {
    return todoList[id];
  } else {
    throw new Error("UUID does not exist");
  }
}

export function updateById(idToUpdate: string, updatedTodo: Todo) {
  if (idToUpdate in todoList) {
    todoList[idToUpdate] = updatedTodo;
  } else {
    throw new Error("UUID does not exist");
  }
}

export function deleteById(idToDelete: string) {
  if (idToDelete in todoList) {
    delete todoList[idToDelete];
  } else {
    throw new Error("UUID does not exist");
  }
}
