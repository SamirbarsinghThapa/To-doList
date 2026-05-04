export interface ITask {
  _id: string;
  text: string;
  date: string;
  time: string;
  completed: boolean;
}

export type CreateTaskInput = Omit<ITask, "_id">;