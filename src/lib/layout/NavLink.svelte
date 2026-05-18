<script lang="ts">
  import type { RouteId } from '../router'

  interface Props {
    href: string
    active: boolean
    label: string
    onclick: (route: RouteId) => void
    route: RouteId
  }

  let { href, active, label, onclick, route }: Props = $props()
</script>

<a
  {href}
  class:active
  aria-current={active ? 'page' : undefined}
  onclick={(e) => {
    e.preventDefault()
    onclick(route)
  }}
>
  {label}
</a>

<style>
  a {
    display: block;
    padding: 0.45rem 0.75rem;
    border-radius: 8px;
    color: var(--text);
    text-decoration: none;
    font-size: 0.9rem;
    transition:
      background 0.15s,
      color 0.15s;
  }

  a:hover {
    background: var(--accent-bg);
    color: var(--text-h);
  }

  a.active {
    background: var(--accent-bg);
    color: var(--accent);
    font-weight: 600;
  }
</style>
