import express, { Application } from "express";
import mongoose from "mongoose";
import cors from "cors";

import taskRoutes from "./routes/taskRoutes";

const app: Application = express();

app.use(cors());

app.use(express.json());

app.use("/tasks", taskRoutes);

export default app;

if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect("mongodb://127.0.0.1:27017/TaskManager_DB")
    .then(() => {
      console.log("MongoDB Connected");

      app.listen(5000, () => {
        console.log("Server running on port 5000");
      });
    })
    .catch((err: unknown) => {
      console.error("MongoDB connection error:", err);
    });
}