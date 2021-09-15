import { Request, Response } from "express";
import { v4 } from "uuid";
import fetch from "node-fetch";
import {
  add,
  getAll,
  getById,
  deleteById,
  updateById,
} from "../datastores/TodoStore";

export async function createTodo(req: Request, res: Response) {
  const newTaskDescription = req.body["description"];
  const newTodo = {
    id: v4(),
    description: newTaskDescription,
    done: false,
  };
  add(newTodo);
  return res.status(200).json(newTodo);
}

// Can mention unused request param
export async function getAllTodos(_req: Request, res: Response) {
  const todoList = getAll();
  return res.status(200).json(todoList);
}

export async function getTodoById(req: Request, res: Response) {
  const { id } = req.params;
  const todo = getById(id);
  return res.status(200).json(todo);
}

export async function updateTodoById(req: Request, res: Response) {
  const { id } = req.params;
  const updatedTodo = req.body;
  try {
    updateById(id, updatedTodo);
    return res.status(200).contentType("text/plain").send("Success");
  } catch (e) {
    const error = e as Error;
    return res.status(400).contentType("text/plain").send(error.message);
  }
}

export async function deleteTodoById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    deleteById(id);
    return res.status(200).contentType("text/plain").send("Success");
  } catch (e) {
    const error = e as Error;
    return res.status(400).contentType("text/plain").send(error.message);
  }
}

export async function createRandomTodo(_req: Request, res: Response) {
  const apiResponse = await fetch("https://www.boredapi.com/api/activity");
  const responseJson = await apiResponse.json();
  const randomActivity = responseJson["activity"];
  const randomTodo = {
    id: v4(),
    description: randomActivity,
    done: false,
  };
  add(randomTodo);
  return res.status(200).json(randomTodo);
}
