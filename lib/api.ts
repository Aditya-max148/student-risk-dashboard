export const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function apiUrl() {
  // Use an env for production deployments; default to empty (same origin) if proxying.
  return process.env.NEXT_PUBLIC_API_BASE_URL || ""
}
