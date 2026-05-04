import type { ITask } from "../types/task";

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function TaskDetail({ task }: { task: ITask | null }) {
  if (!task) return null;

  return (
    <div className="bg-indigo-50 border border-t-0 border-indigo-200 rounded-b-2xl px-5 py-4 mb-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-[10px] font-semibold tracking-widest text-indigo-400 uppercase mb-2">
            Task Detail
          </p>
          <p className="text-sm text-gray-800 leading-relaxed font-medium">
            {task.text}
          </p>
          {task.date && (
            <p className="text-xs text-gray-400 mt-2">
              {formatDate(task.date)}
              {task.time && ` · ${task.time}`}
            </p>
          )}
        </div>
        <span
          className={`text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full shrink-0 mt-1 ${
            task.completed
              ? "bg-green-100 text-green-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {task.completed ? "Completed" : "Pending"}
        </span>
      </div>
    </div>
  );
}