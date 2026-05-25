import type { ITask } from "../../types/task";

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

type Props = {
  tasks: ITask[];
  onUndo: (task: ITask, e: React.MouseEvent) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
};

export default function CompletedTaskList({ tasks, onUndo, onDelete }: Props) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="8.5" stroke="#d1d5db" strokeWidth="1.7" />
            <path d="M7 11l3 3 5-6" stroke="#d1d5db" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-sm text-gray-400">No completed tasks yet.</p>
        <p className="text-xs text-gray-300 mt-1">Finish some tasks to see them here.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {tasks.map((task) => (
        <div
          key={task._id}
          className="group bg-white border border-gray-100 rounded-xl px-4 py-3.5 flex items-center gap-3 shadow-sm hover:shadow-md transition-all"
        >
          {/* Check icon */}
          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0">
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Text */}
          <p className="flex-1 text-sm text-gray-400 line-through leading-snug">{task.text}</p>

          {/* Date */}
          {task.date && (
            <span className="text-xs text-gray-300 shrink-0">
              {formatDate(task.date)}{task.time && ` · ${task.time}`}
            </span>
          )}

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => onUndo(task, e)}
              className="text-xs font-medium text-indigo-400 hover:text-indigo-600 px-2 py-1 rounded-lg hover:bg-indigo-50 transition-all"
              title="Mark as pending"
            >
              Undo
            </button>
            <button
              onClick={(e) => onDelete(task._id, e)}
              className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-all"
              aria-label="Delete"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
