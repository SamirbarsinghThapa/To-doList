import type { ITask } from "../../types/task";
import TaskDetail from "./TaskDetail";

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

type TaskListProps = {
  tasks: ITask[];
  selectedTask: ITask | null;
  onSelect: (id: string) => void;
  onToggle: (task: ITask, e: React.MouseEvent, cb: (updated: ITask) => void) => void;
  onDelete: (id: string, e: React.MouseEvent, cb: () => void) => void;
}

export default function TaskList({
  tasks,
  selectedTask,
  onSelect,
  onToggle,
  onDelete,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center mx-auto mb-3">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 6h12M4 10h8M4 14h10" stroke="#9ca3af" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>
        <p className="text-gray-400 text-sm">No tasks yet. Add one above.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {tasks.map((task) => {
        const isSelected = selectedTask?._id === task._id;
        return (
          <div key={task._id}>
            <div
              onClick={() => onSelect(task._id)}
              className={`group bg-white border px-4 py-3.5 cursor-pointer transition-all shadow-sm hover:shadow-md ${
                isSelected
                  ? "border-indigo-400 ring-1 ring-indigo-200 rounded-t-xl rounded-b-none"
                  : "border-gray-200 hover:border-gray-300 rounded-xl"
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) =>
                    onToggle(task, e, (updated) => {
                      if (selectedTask?._id === task._id) onSelect(updated._id);
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

                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                  task.completed ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                }`}>
                  {task.completed ? "Done" : "Pending"}
                </span>

                <button
                  onClick={(e) =>
                    onDelete(task._id, e, () => {
                      if (selectedTask?._id === task._id) onSelect(task._id);
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
  );
}