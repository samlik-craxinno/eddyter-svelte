export type RouteId = 'basic' | 'multi' | 'lifecycle' | 'comments' | 'modal'

const ROUTE_PATHS: Record<RouteId, string> = {
  basic: '/basic',
  multi: '/multi-editors',
  lifecycle: '/lifecycle',
  comments: '/comments',
  modal: '/modal',
}

const PATH_TO_ROUTE = new Map(
  Object.entries(ROUTE_PATHS).map(([id, path]) => [path, id as RouteId]),
)

export function parseRoute(hash: string): RouteId {
  const path = hash.replace(/^#/, '') || '/basic'
  return PATH_TO_ROUTE.get(path) ?? 'basic'
}

export function routePath(route: RouteId): string {
  return ROUTE_PATHS[route]
}

export const NAV_ITEMS: { id: RouteId; label: string }[] = [
  { id: 'basic', label: 'Basic editor' },
  { id: 'multi', label: 'Multi editors' },
  { id: 'lifecycle', label: 'Lifecycle' },
  { id: 'comments', label: 'Comments' },
  { id: 'modal', label: 'Modal editor' },
]
