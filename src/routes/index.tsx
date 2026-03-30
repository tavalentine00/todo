import { Link, createFileRoute } from '@tanstack/react-router'
import { useMutation } from 'convex/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '../../convex/_generated/api'

export const Route = createFileRoute('/')({
  component: TaskManager,
})

function formatCreatedAt(ms: number) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(ms))
}

function TaskManager() {
  const { data: todos } = useSuspenseQuery(convexQuery(api.todos.list, {}))
  const removeTodo = useMutation(api.todos.remove)
  const toggleCompleted = useMutation(api.todos.toggleCompleted)

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Task Manager
        </h1>
        <p className="mt-1 text-sm text-[var(--app-muted)]">
          Stay on top of what matters. Create, edit, and complete your tasks.
        </p>
      </div>

      {todos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--app-border)] bg-[var(--app-card)] p-10 text-center shadow-sm">
          <p className="text-slate-600 dark:text-slate-400">
            No tasks yet. Add your first one with{' '}
            <span className="font-medium text-violet-600 dark:text-violet-400">
              + new task
            </span>
            .
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {todos.map((todo) => (
            <li
              key={todo._id}
              className="group flex items-stretch gap-3 rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] p-4 shadow-sm transition hover:shadow-md"
            >
              <button
                type="button"
                onClick={() => void toggleCompleted({ id: todo._id })}
                className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-400 transition hover:border-violet-300 hover:bg-violet-50 dark:border-slate-600 dark:bg-slate-800/50 dark:hover:border-violet-500/50 dark:hover:bg-violet-950/40"
                title={
                  todo.completed ? 'Mark as pending' : 'Mark as completed'
                }
                aria-label={
                  todo.completed ? 'Mark as pending' : 'Mark as completed'
                }
              >
                {todo.completed ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5 text-violet-600 dark:text-violet-400"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <span className="h-3 w-3 rounded-sm border-2 border-current opacity-40" />
                )}
              </button>
              <div className="min-w-0 flex-1">
                <p
                  className={`font-medium leading-snug ${
                    todo.completed
                      ? 'text-slate-400 line-through dark:text-slate-500'
                      : 'text-slate-900 dark:text-slate-100'
                  }`}
                >
                  {todo.description}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--app-muted)]">
                  <span
                    className={
                      todo.completed
                        ? 'font-medium text-emerald-600 dark:text-emerald-400'
                        : 'font-medium text-amber-600 dark:text-amber-400'
                    }
                  >
                    {todo.completed ? 'Completed' : 'Pending'}
                  </span>
                  <span className="hidden sm:inline" aria-hidden>
                    ·
                  </span>
                  <span>Created {formatCreatedAt(todo._creationTime)}</span>
                </div>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
                <Link
                  to="/tasks/$taskId/edit"
                  params={{ taskId: todo._id }}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-violet-500/40 dark:hover:bg-violet-950/50 dark:hover:text-violet-200"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    if (
                      typeof window !== 'undefined' &&
                      !window.confirm('Delete this task?')
                    ) {
                      return
                    }
                    void removeTodo({ id: todo._id })
                  }}
                  className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-700 transition hover:bg-red-50 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300 dark:hover:bg-red-950/50"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
