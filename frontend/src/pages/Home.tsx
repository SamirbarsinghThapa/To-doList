import { useState } from "react";
import type { ITask } from "../types/task";
import { getTaskById } from "../api/taskApi";
import { useTasks, useTaskActions } from "../hooks/useTasks";
import AddTaskForm from "../components/AddTaskForm";
import TaskDetail from "../components/TaskDetail";

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

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
        ) : tasks.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center mx-auto mb-3">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 6h12M4 10h8M4 14h10" stroke="#9ca3af" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-gray-400 text-sm">No tasks yet. Add one above.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {tasks.map((task) => {
              const isSelected = selectedTask?._id === task._id;
              return (
                <div key={task._id}>
                  <div
                    onClick={() => handleSelect(task._id)}
                    className={`group bg-white border px-4 py-3.5 cursor-pointer transition-all shadow-sm hover:shadow-md ${
                      isSelected
                        ? "border-indigo-400 ring-1 ring-indigo-200 rounded-t-xl rounded-b-none"
                        : "border-gray-200 hover:border-gray-300 rounded-xl"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) =>
                          handleToggle(task, e, (updated) => {
                            if (selectedTask?._id === task._id) setSelectedTask(updated);
                          })
                        }
                        className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                          task.completed ? "border-indigo-500 bg-indigo-500" : "border-gray-300 hover:border-indigo-400"
                        }`}
                        aria-label="Toggle complete"
                      >
                        {task.completed && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </button>

                      <p className={`flex-1 text-sm leading-snug transition-colors ${task.completed ? "line-through text-gray-400" : "text-gray-800"}`}>
                        {task.text}
                      </p>

                      {task.date && (
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full shrink-0">
                          {formatDate(task.date)}{task.time && ` · ${task.time}`}
                        </span>
                      )}

                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${task.completed ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                        {task.completed ? "Done" : "Pending"}
                      </span>

                      <button
                        onClick={(e) =>
                          handleDelete(task._id, e, () => {
                            if (selectedTask?._id === task._id) setSelectedTask(null);
                          })
                        }
                        className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-all shrink-0"
                        aria-label="Delete task"
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {isSelected && <TaskDetail task={selectedTask} />}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}