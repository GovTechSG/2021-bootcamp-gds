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

// For a demo, can ignore for now
todoRouter.get("/demo/time", (req, res) => res.status(200).send({ time: new Date().toTimeString() }));

export default todoRouter;
