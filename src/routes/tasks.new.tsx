import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation } from 'convex/react'
import * as React from 'react'
import { api } from '../../convex/_generated/api'

export const Route = createFileRoute('/tasks/new')({
  component: CreateTaskPage,
})

function CreateTaskPage() {
  const navigate = useNavigate()
  const createTodo = useMutation(api.todos.create)
  const [description, setDescription] = React.useState('')
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await createTodo({ description })
      void navigate({ to: '/' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create task')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
        Create New Task
      </h1>
      <p className="mt-1 text-sm text-[var(--app-muted)]">
        Describe what you need to get done.
      </p>

      <form
        onSubmit={(e) => void handleCreate(e)}
        className="mt-8 space-y-6 rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] p-6 shadow-sm"
      >
        <div>
          <label
            htmlFor="task-description"
            className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Task description
          </label>
          <textarea
            id="task-description"
            name="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description"
            className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-inner placeholder:text-slate-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-slate-600 dark:bg-slate-900/50 dark:text-slate-100 dark:placeholder:text-slate-500"
            required
            autoComplete="off"
          />
        </div>

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
            {submitting ? 'Creating…' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  )
}
