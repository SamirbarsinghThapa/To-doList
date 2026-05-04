import type { ITask } from "../types/task";

const API = `${import.meta.env.VITE_API_URL ?? "http://localhost:5000"}/tasks`;

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const message = await res.text().catch(() => res.statusText);
    throw new Error(`API error ${res.status}: ${message}`);
  }
  return res.json() as Promise<T>;
}

export const fetchTasks = async (): Promise<ITask[]> => {
  const res = await fetch(API);
  return handleResponse<ITask[]>(res);
};

export const getTaskById = async (id: string): Promise<ITask> => {
  const res = await fetch(`${API}/${id}`);
  return handleResponse<ITask>(res);
};

export const createTask = async (task: Omit<ITask, "_id">): Promise<ITask> => {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  return handleResponse<ITask>(res);
};

export const updateTask = async (
  id: string,
  data: Partial<Omit<ITask, "_id">>,
): Promise<ITask> => {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<ITask>(res);
};

export const deleteTask = async (id: string): Promise<void> => {
  const res = await fetch(`${API}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Delete failed: ${res.statusText}`);
};

export const deleteAllTasks = async (): Promise<void> => {
  const res = await fetch(`${API}/deletemany`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Delete all failed: ${res.statusText}`);
};

export const bulkCreateTasks = async (
  tasks: Omit<ITask, "_id">[],
): Promise<ITask[]> => {
  const res = await fetch(`${API}/bulk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tasks),
  });
  return handleResponse<ITask[]>(res);
};