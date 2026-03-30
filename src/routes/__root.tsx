import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import * as React from 'react'
import type { QueryClient } from '@tanstack/react-query'
import appCss from '~/styles/app.css?url'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Task Manager',
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      { rel: 'manifest', href: '/site.webmanifest', color: '#fffff' },
      { rel: 'icon', href: '/favicon.ico' },
    ],
  }),
  notFoundComponent: () => (
    <div className="min-h-svh flex items-center justify-center text-slate-600">
      Route not found
    </div>
  ),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <div className="min-h-svh flex flex-col bg-[var(--app-bg)] text-[var(--app-fg)]">
        <header className="sticky top-0 z-10 border-b border-[var(--app-border)] bg-[var(--app-header)]/95 backdrop-blur-md shadow-sm">
          <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-4 px-4 sm:px-6">
            <Link
              to="/"
              activeOptions={{ exact: true }}
              className="group flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold tracking-tight text-slate-800 transition-colors hover:bg-slate-100/80 dark:text-slate-100 dark:hover:bg-slate-800/60"
              activeProps={{
                className:
                  'group flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold tracking-tight text-violet-700 dark:text-violet-300',
              }}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white shadow-md shadow-violet-600/25 transition-transform group-hover:scale-105">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                  aria-hidden
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              Tasks
            </Link>
            <Link
              to="/tasks/new"
              className="inline-flex items-center gap-1.5 rounded-full bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-md shadow-violet-600/30 transition hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
            >
              <span className="text-lg leading-none">+</span>
              new task
            </Link>
          </div>
        </header>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
