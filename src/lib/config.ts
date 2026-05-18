const apiKey = import.meta.env.VITE_EDDYTER_API_KEY?.trim() ?? ''

if (!apiKey && import.meta.env.DEV) {
  console.warn(
    '[eddyter] VITE_EDDYTER_API_KEY is not set. Copy .env.example to .env and add your API key.',
  )
}

/** Shared Eddyter API key for all editors in this app (from VITE_EDDYTER_API_KEY). */
export const EDDYTER_API_KEY = apiKey
