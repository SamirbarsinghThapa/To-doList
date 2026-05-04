import { Request, Response } from "express";
import Task, { ITask } from "../models/Task";

export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find();
    return res.json(tasks);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return res.status(500).json({ error: message });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const { text, date, time, completed } = req.body as ITask;
    if (!date || !time) {
      return res.status(400).json({ error: "Enter time and Date" });
    }
    const clash = await Task.findOne({ date, time });
    if (clash) {
      return res.status(409).json({
        error: `A task already exists at ${date} ${time}. Please choose a different date or time.`,
      });
    }
    const newTask = new Task({
      text,
      date,
      time,
      completed: completed ?? false,
    });
    await newTask.save();
    return res.status(201).json(newTask);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return res.status(500).json({ error: message });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: { completed: req.body.completed } },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Task not found" });
    }
    console.log("Toggled task:", updated._id, "completed:", updated.completed);
    return res.json(updated);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return res.status(500).json({ error: message });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Task not found" });
    }
    return res.json({ message: "Deleted" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return res.status(500).json({ error: message });
  }
};

export const getSingleTaskDetail = async (req: Request, res: Response) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    return res.json(task);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return res.status(500).json({ error: message });
  }
};

export const WriteMultipleTasks = async (req: Request, res: Response) => {
  try {
    const tasks: ITask[] = req.body;
    if (!Array.isArray(tasks) || tasks.length === 0 || tasks.some((t) => !t.date || !t.time)) {
      return res.status(400).json({ error: "Provide tasks and each must have a date and time." });
    }
    const clashQuery = tasks.map(({ date, time }) => ({ date, time }));
    const existingClash = await Task.findOne({ $or: clashQuery });
    if (existingClash) {
      return res.status(409).json({
        error: `A task already exists at ${existingClash.date} ${existingClash.time}`,
      });
    }
    const created = await Task.insertMany(
      tasks.map((t) => ({
        text: t.text,
        date: t.date,
        time: t.time,
        completed: t.completed ?? false,
      }))
    );
    return res.status(201).json(created);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return res.status(500).json({ error: message });
  }
};

export const deleteallTask = async (req: Request, res: Response) => {
  try {
    const result = await Task.deleteMany({});
    return res.json({
      message: "All Tasks deleted",
      deletedCount: result.deletedCount,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return res.status(500).json({ error: message });
  }
};