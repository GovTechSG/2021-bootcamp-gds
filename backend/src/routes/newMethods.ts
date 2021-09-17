import { Request, Response } from "express";
import { todoList } from "./methods";

export async function updateTodoById(req: Request, res: Response) {
    const { id } = req.params;
    const updatedTodo = req.body;
    if (id in todoList) {
        todoList[id] = updatedTodo;
        return res.sendStatus(200);
    } else {
        return res.status(400).json({ message: "UUID does not exist" });
    }
}
  
export async function deleteTodoById(req: Request, res: Response) {
    const { id } = req.params;
    if (id in todoList) {
        delete todoList[id];
    } else {
        return res.status(400).json({ message: "UUID does not exist" });
    }
}
  