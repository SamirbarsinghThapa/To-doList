import { Router } from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  WriteMultipleTasks,
  getSingleTaskDetail,
  deleteallTask,
} from "../controllers/taskController";
const router: Router = Router();
router.get("/",                 getTasks);
router.post("/",                createTask);
router.post("/bulk",            WriteMultipleTasks);
router.delete("/deletemany",    deleteallTask);
router.delete("/:id",           deleteTask);
router.get("/:id",              getSingleTaskDetail);
router.put("/:id",              updateTask);

export default router;