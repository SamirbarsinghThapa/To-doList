import { useState } from "react";
import type { CreateTaskInput } from "../types/task";

interface TaskRow {
  id: number;
  text: string;
  date: string;
  time: string;
}

interface Props {
  onAdd: (tasks: CreateTaskInput[]) => Promise<void>;
  error?: string | null;
}

let rc = 0;
const newRow = (): TaskRow => ({ id: ++rc, text: "", date: "", time: "" });

const XIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path
      d="M1 1l8 8M9 1L1 9"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

export default function AddTaskForm({ onAdd, error }: Props) {
  const [rows, setRows] = useState<TaskRow[]>([newRow()]);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [duplicateIds, setDuplicateIds] = useState<Set<number>>(new Set());
  const [missingIds, setMissingIds] = useState<Set<number>>(new Set());

  const setField = (
    id: number,
    field: keyof Omit<TaskRow, "id">,
    val: string,
  ) =>
    setRows((prev) => {
      const updated = prev.map((r) =>
        r.id === id ? { ...r, [field]: val } : r,
      );
      setDuplicateIds(findDuplicateIds(updated));
      setMissingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      return updated;
    });

  const addRow = () => setRows((prev) => [...prev, newRow()]);

  const removeRow = (id: number) => {
    if (rows.length > 1) {
      const updated = rows.filter((r) => r.id !== id);
      setDuplicateIds(findDuplicateIds(updated));
      setMissingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setRows(updated);
    }
  };

  function findDuplicateIds(rows: TaskRow[]): Set<number> {
    const seen = new Map<string, number>();
    const dupes = new Set<number>();
    for (const row of rows) {
      if (!row.text.trim()) continue;
      const key = `${row.text.trim().toLowerCase()}||${row.time.trim()}`;
      if (seen.has(key)) {
        dupes.add(row.id);
        dupes.add(seen.get(key)!);
      } else {
        seen.set(key, row.id);
      }
    }
    return dupes;
  }

  const handleAdd = async () => {
    const filled = rows.filter((r) => r.text.trim());

    if (!filled.length) {
      setValidationError("At least one task description is required.");
      return;
    }

    const missingDateTime = filled.filter((r) => !r.date || !r.time);
    if (missingDateTime.length > 0) {
      setMissingIds(new Set(missingDateTime.map((r) => r.id)));
      setValidationError(
        missingDateTime.length === 1
          ? "Please add a date and time for the task."
          : `${missingDateTime.length} tasks are missing a date or time.`,
      );
      return;
    }

    const dupes = findDuplicateIds(filled);
    if (dupes.size > 0) {
      setDuplicateIds(dupes);
      setValidationError("Each task must have a unique description and time.");
      return;
    }

    setDuplicateIds(new Set());
    setMissingIds(new Set());
    setValidationError(null);
    setLoading(true);
    try {
      await onAdd(
        filled.map((r) => ({
          text: r.text.trim(),
          date: r.date,
          time: r.time,
          completed: false,
        })),
      );
      setRows([newRow()]);
    } finally {
      setLoading(false);
    }
  };

  const displayError = validationError ?? error;
  const isMulti = rows.length > 1;
  const filledCount = rows.filter((r) => r.text.trim()).length;

  const inputCls =
    "bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all";

  const errorCls =
    "bg-red-50 border border-red-300 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4 shadow-sm">
      <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">
        New Task{isMulti ? "s" : ""}
      </p>

      {/* Column headers */}
      <div
        className={`grid gap-3 mb-2 px-0.5 ${isMulti ? "grid-cols-[1fr_160px_130px_28px]" : "grid-cols-[1fr_160px_130px]"}`}
      >
        <span className="text-[10px] tracking-widest text-gray-400 uppercase font-semibold">
          Description
        </span>
        <span className="text-[10px] tracking-widest text-gray-400 uppercase font-semibold">
          Date
        </span>
        <span className="text-[10px] tracking-widest text-gray-400 uppercase font-semibold">
          Time
        </span>
        {isMulti && <span />}
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-2 mb-3">
        {rows.map((row) => {
          const isDupe = duplicateIds.has(row.id);
          const isMissing = missingIds.has(row.id);
          const isError = isDupe || isMissing;
          const rowInputCls = isError ? errorCls : inputCls;

          return (
            <div key={row.id} className="relative">
              <div
                className={`grid gap-3 items-center ${isMulti ? "grid-cols-[1fr_160px_130px_28px]" : "grid-cols-[1fr_160px_130px]"}`}
              >
                <input
                  className={rowInputCls + " w-full"}
                  placeholder="Enter Your Task"
                  value={row.text}
                  onChange={(e) => {
                    setField(row.id, "text", e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addRow();
                  }}
                  disabled={loading}
                />
                <input
                  type="date"
                  value={row.date}
                  onChange={(e) => {
                    setField(row.id, "date", e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  disabled={loading}
                  className={`${isMissing && !row.date ? errorCls : inputCls} w-full`}
                />
                <input
                  type="time"
                  value={row.time}
                  onChange={(e) => {
                    setField(row.id, "time", e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  disabled={loading}
                  className={`${isMissing && !row.time ? errorCls : inputCls} w-full`}
                />
                {isMulti && (
                  <button
                    onClick={() => removeRow(row.id)}
                    disabled={rows.length === 1 || loading}
                    className="w-7 h-7 flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 disabled:opacity-20 transition-all rounded-lg"
                  >
                    <XIcon />
                  </button>
                )}
              </div>

              {/* Per-row inline warning */}
              {isDupe && (
                <p className="text-[11px] text-red-500 mt-1 ml-1">
                  Duplicate: same description + time as another row.
                </p>
              )}
              {isMissing && (
                <p className="text-[11px] text-red-500 mt-1 ml-1">
                  {!row.date && !row.time
                    ? "Date and time are required."
                    : !row.date
                      ? "Date is required."
                      : "Time is required."}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Add another row */}
      <button
        onClick={addRow}
        disabled={loading}
        className="text-xs text-gray-400 hover:text-indigo-600 transition-colors mb-3 flex items-center gap-1 font-medium"
      >
        <span className="text-sm leading-none">+</span> Add another task
      </button>

      {displayError && (
        <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">
          {displayError}
        </p>
      )}

      <div className="flex items-center justify-between">
        {isMulti ? (
          <span className="text-xs text-gray-400">
            {filledCount} of {rows.length} filled
          </span>
        ) : (
          <span />
        )}
        <button
          onClick={handleAdd}
          disabled={loading || filledCount === 0 || duplicateIds.size > 0}
          className="bg-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {loading
            ? "Adding…"
            : isMulti
              ? `+ Add ${filledCount} Task${filledCount !== 1 ? "s" : ""}`
              : "+ Add Task"}
        </button>
      </div>
    </div>
  );
}
