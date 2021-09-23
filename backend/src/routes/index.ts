import { Router } from "express";
import {
  createTodo,
  getAllTodos,
  deleteTodoById,
  getTodoById, 
  updateTodoById,
  createRandomTodo
} from "./methods";

const todoRouter = Router();
todoRouter.post("/todos", createTodo);
todoRouter.get("/todos", getAllTodos);
todoRouter.get("/todos/:id", getTodoById);
todoRouter.put("/todos/:id", updateTodoById);
todoRouter.delete("/todos/:id", deleteTodoById);
todoRouter.post("/todos/random", createRandomTodo);

export default todoRouter;
