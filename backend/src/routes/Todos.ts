import { Request, Response } from "express";
import { v4 } from "uuid";
import fetch from "node-fetch";
import AbortController from "abort-controller";
import {
  add,
  getAll,
  getById,
  deleteById,
  updateById,
} from "../datastores/TodoStore";

function messageResponse(res: Response, code: number, errorMessage: string) {
  return res.status(code).json(`{ message: ${errorMessage} }`);
}

export async function createTodo(req: Request, res: Response) {
  const body = req.body;
  if (!("description" in body)) {
    return messageResponse(res, 400, "Input task required");
  }
  const newTaskDescription = body["description"];
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
  try {
    const todo = getById(id);
    return res.status(200).json(todo);
  } catch (e) {
    const error = e as Error;
    return messageResponse(res, 400, error.message);
  }
}

export async function updateTodoById(req: Request, res: Response) {
  const { id } = req.params;
  const updatedTodo = req.body;
  try {
    updateById(id, updatedTodo);
    return res.sendStatus(200);
  } catch (e) {
    const error = e as Error;
    return messageResponse(res, 400, error.message);
  }
}

export async function deleteTodoById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    deleteById(id);
    return res.sendStatus(200);
  } catch (e) {
    const error = e as Error;
    return messageResponse(res, 400, error.message);
  }
}

export async function createRandomTodo(_req: Request, res: Response) {
  const abortController = new AbortController();
  setTimeout(() => abortController.abort(), 5000);

  try {
    const apiResponse = await fetch("https://www.boredapi.com/api/activity", {
      signal: abortController.signal,
    });
    const responseJson = await apiResponse.json();
    const randomActivity = responseJson["activity"];
    const randomTodo = {
      id: v4(),
      description: randomActivity,
      done: false,
    };
    add(randomTodo);
    return res.status(200).json(randomTodo);
  } catch (e) {
    // AbortError not exported in node-fetch V2
    return messageResponse(res, 500, "Request from external api timed out");
  }
}
