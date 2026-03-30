import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation } from 'convex/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import * as React from 'react'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'

export const Route = createFileRoute('/tasks/$taskId/edit')({
  component: EditTaskPage,
})

function EditTaskPage() {
  const { taskId } = Route.useParams()
  const navigate = useNavigate()
  const id = taskId as Id<'todos'>

  const { data: todo } = useSuspenseQuery(convexQuery(api.todos.get, { id }))

  const updateTodo = useMutation(api.todos.update)
  const [description, setDescription] = React.useState('')
  const [completed, setCompleted] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (todo) {
      setDescription(todo.description)
      setCompleted(todo.completed)
    }
  }, [todo])

  if (!todo) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-slate-600 dark:text-slate-400">Task not found.</p>
        <button
          type="button"
          onClick={() => void navigate({ to: '/' })}
          className="mt-4 text-sm font-medium text-violet-600 hover:underline dark:text-violet-400"
        >
          Back to tasks
        </button>
      </div>
    )
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await updateTodo({ id, description, completed })
      void navigate({ to: '/' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
        Edit Task
      </h1>
      <p className="mt-1 text-sm text-[var(--app-muted)]">
        Update the description or completion status.
      </p>

      <form
        onSubmit={(e) => void handleSave(e)}
        className="mt-8 space-y-6 rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] p-6 shadow-sm"
      >
        <div>
          <label
            htmlFor="edit-description"
            className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Task description
          </label>
          <textarea
            id="edit-description"
            name="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description"
            className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-inner placeholder:text-slate-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-slate-600 dark:bg-slate-900/50 dark:text-slate-100 dark:placeholder:text-slate-500"
            required
          />
        </div>

        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-slate-600 dark:bg-slate-800/40">
          <input
            type="checkbox"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
          />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Mark as completed
          </span>
        </label>

        {error ? (
          <p className="text-sm font-medium text-red-600 dark:text-red-400">
            {error}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void navigate({ to: '/' })}
            className="inline-flex flex-1 min-w-[7rem] items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/80"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || !description.trim()}
            className="inline-flex flex-1 min-w-[7rem] items-center justify-center rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-violet-600/25 transition hover:bg-violet-500 disabled:pointer-events-none disabled:opacity-50"
          >
            {submitting ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
