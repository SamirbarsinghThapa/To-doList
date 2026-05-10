import { useState } from "react";
import type { ITask } from "../types/task";
import { getTaskById } from "../api/taskApi";
import { useTasks, useTaskActions } from "../hooks/useTasks";
import AddTaskForm from "../components/AddTaskForm";
import TaskList from "../components/TaskList";

export default function Home() {
  const { data: tasks = [], isLoading, isError } = useTasks();
  const { handleAdd, handleToggle, handleDelete, handleDeleteAll, error } = useTaskActions();
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);

  const handleSelect = async (id: string) => {
    if (selectedTask?._id === id) {
      setSelectedTask(null);
      return;
    }
    const task = await getTaskById(id);
    setSelectedTask(task);
  };

  const pending = tasks.filter((t) => !t.completed).length;
  const done = tasks.filter((t) => t.completed).length;

  return (
    <div className="min-h-screen bg-[#f5f6fa] py-10 px-5 font-sans">
      <div className="max-w-180 mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 4h12M2 8h8M2 12h10" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Task Manager</h1>
          </div>
          <div className="flex items-center gap-2 ml-11">
            <span className="text-xs text-gray-400 font-medium">{pending} pending</span>
            <span className="text-gray-300">·</span>
            <span className="text-xs text-gray-400 font-medium">{done} completed</span>
            {tasks.length > 0 && (
              <>
                <span className="text-gray-300">·</span>
                <button
                  onClick={() => handleDeleteAll(() => setSelectedTask(null))}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors font-medium"
                >
                  Delete all
                </button>
              </>
            )}
          </div>
        </div>

        {/* Add Task Form */}
        <AddTaskForm onAdd={handleAdd} error={error} />

        {/* Task List */}
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 text-gray-400 text-sm py-16">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            Loading tasks…
          </div>
        ) : isError ? (
          <div className="text-center py-16">
            <p className="text-red-400 text-sm">Could not connect to server.</p>
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            selectedTask={selectedTask}
            onSelect={handleSelect}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        )}

      </div>
    </div>
  );
}