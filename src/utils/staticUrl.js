export function staticUrl(path) {
  const normalizedPath = String(path).replace(/^\/+/, '')

  if (typeof document === 'undefined') {
    return `/static/${normalizedPath}`
  }

  return `${import.meta.env.BASE_URL}static/${normalizedPath}`
}
