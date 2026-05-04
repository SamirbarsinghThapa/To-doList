import express, { Application } from "express";
import mongoose from "mongoose";
import cors from "cors";
import taskRoutes from "./routes/taskRoutes";

const app: Application = express();
app.use(cors());
app.use(express.json());
mongoose
  .connect("mongodb://127.0.0.1:27017/TaskManager_DB")
  .then(() => console.log("MongoDB Connected"))
  .catch((err: unknown) => console.error("MongoDB connection error:", err));
app.use("/tasks", taskRoutes);
app.listen(5000, () => console.log("Server running on port 5000"));