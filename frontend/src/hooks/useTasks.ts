import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  deleteAllTasks,
  bulkCreateTasks,
} from "../api/taskApi";
import type { CreateTaskInput, ITask } from "../types/task";
import { useState } from "react";

export const useTasks = () => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });
};

export const useTaskActions = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const refetch = () => queryClient.invalidateQueries({ queryKey: ["tasks"] });

  const handleAdd = async (newTasks: CreateTaskInput[]) => {
    try {
      setError(null);
      if (newTasks.length === 1) {
        await createTask(newTasks[0]);
      } else {
        await bulkCreateTasks(newTasks);
      }
      await refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
    }
  };

  const handleToggle = async (
    task: ITask,
    e: React.MouseEvent,
    onSuccess?: (updated: ITask) => void,
  ) => {
    e.stopPropagation();
    const updated = await updateTask(task._id, { completed: !task.completed });
    await refetch();
    onSuccess?.(updated);
  };

  const handleDelete = async (
    id: string,
    e: React.MouseEvent,
    onSuccess?: () => void,
  ) => {
    e.stopPropagation();
    await deleteTask(id);
    await refetch();
    onSuccess?.();
  };

  const handleDeleteAll = async (onSuccess?: () => void) => {
    await deleteAllTasks();
    await refetch();
    onSuccess?.();
  };

  return { handleAdd, handleToggle, handleDelete, handleDeleteAll, error };
};