import { useTasks, useTaskActions } from "../hooks/useTasks";
import CompletedTaskList from "../components/tasks/CompletedTaskList";
import PageHeader from "../components/layout/PageHeader";
import type { ITask } from "../types/task";

export default function Completed() {
  const { data: tasks = [], isLoading, isError } = useTasks();
  const { handleToggle, handleDelete } = useTaskActions();

  const completedTasks = tasks.filter((t) => t.completed);

  const handleUndo = (task: ITask, e: React.MouseEvent) => {
    handleToggle(task, e);
  };

  const handleDeleteCompleted = (id: string, e: React.MouseEvent) => {
    handleDelete(id, e);
  };

  return (
    <>
      <PageHeader
        title="Completed Tasks"
        subtitle="Tasks you've finished"
        badge={{
          label: `${completedTasks.length} done`,
          color: "green",
        }}
      />

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 text-gray-400 text-sm py-16">
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          Loading…
        </div>
      ) : isError ? (
        <div className="text-center py-16">
          <p className="text-red-400 text-sm">Could not connect to server.</p>
        </div>
      ) : (
        <>
          {/* Stats banner */}
          {completedTasks.length > 0 && (
            <div className="flex items-center gap-6 bg-green-50 border border-green-100 rounded-2xl px-5 py-4 mb-5">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{completedTasks.length}</p>
                <p className="text-xs text-green-500 mt-0.5">Completed</p>
              </div>
              <div className="h-8 w-px bg-green-200" />
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-400">{tasks.filter(t => !t.completed).length}</p>
                <p className="text-xs text-gray-400 mt-0.5">Still pending</p>
              </div>
              <div className="h-8 w-px bg-green-200" />
              <div className="text-center">
                <p className="text-2xl font-bold text-indigo-600">
                  {tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%
                </p>
                <p className="text-xs text-indigo-400 mt-0.5">Done rate</p>
              </div>
            </div>
          )}

          <CompletedTaskList
            tasks={completedTasks}
            onUndo={handleUndo}
            onDelete={handleDeleteCompleted}
          />
        </>
      )}
    </>
  );
}
