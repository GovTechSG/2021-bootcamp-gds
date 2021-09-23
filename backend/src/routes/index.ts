import { Router } from "express";
import {
  createTodo,
  getAllTodos,
  deleteTodoById,
} from "./methods";
import { updateTodoById } from "./newMethods";

const todoRouter = Router();
todoRouter.post("/todos", createTodo);
todoRouter.get("/todos", getAllTodos);
todoRouter.put("/todos/:id", updateTodoById);
todoRouter.delete("/todos/:id", deleteTodoById);

export default todoRouter;
