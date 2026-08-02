'use client'

import { useEffect } from 'react'
import { RefreshCcw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[App Error]', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
          <span className="text-3xl">⚠️</span>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            {error.message || 'An unexpected error occurred'}
          </p>
          {error.digest && (
            <p className="text-xs text-muted-foreground/60 mt-1 font-mono">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        {/* Show stack in dev for easier debugging */}
        {process.env.NODE_ENV !== 'production' && error.stack && (
          <pre className="text-left text-xs bg-muted p-4 rounded-xl overflow-auto max-h-48 text-muted-foreground">
            {error.stack}
          </pre>
        )}

        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground
            rounded-full font-semibold hover:bg-primary/90 transition-colors"
        >
          <RefreshCcw className="w-4 h-4" />
          Try again
        </button>
      </div>
    </div>
  )
}
