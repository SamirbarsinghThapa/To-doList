import mongoose, { Schema } from "mongoose";

export interface ITask {
  text: string;
  date: string;
  time: string;
  completed: boolean;
}

const taskSchema = new Schema<ITask>(
  {
    text: { type: String, required: true },
    date: { type: String, default: "" },
    time: { type: String, default: "" },
    completed: { type: Boolean, default: false },
  },
  { strict: false },
);
export default mongoose.model<ITask>("Task", taskSchema);
