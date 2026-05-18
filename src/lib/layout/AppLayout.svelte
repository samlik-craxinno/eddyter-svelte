<script lang="ts">
  import type { Snippet } from 'svelte'
  import { NAV_ITEMS, routePath, type RouteId } from '../router'
  import NavLink from './NavLink.svelte'

  interface Props {
    route: RouteId
    navigate: (route: RouteId) => void
    children: Snippet
  }

  let { route, navigate, children }: Props = $props()
</script>

<div class="app-shell">
  <header class="app-shell__header">
    <div class="app-shell__brand">
      <span class="app-shell__logo">E</span>
      <div>
        <p class="app-shell__title">Eddyter Svelte</p>
        <p class="app-shell__subtitle">richtext-core-svelte adapter test</p>
      </div>
    </div>
  </header>

  <div class="app-shell__body">
    <nav class="app-shell__nav" aria-label="Main">
      <ul>
        {#each NAV_ITEMS as item (item.id)}
          <li>
            <NavLink
              href={routePath(item.id)}
              route={item.id}
              label={item.label}
              active={route === item.id}
              onclick={navigate}
            />
          </li>
        {/each}
      </ul>
    </nav>

    <main class="app-shell__main">
      {@render children()}
    </main>
  </div>
</div>

<style>
  .app-shell {
    min-height: 100svh;
    display: flex;
    flex-direction: column;
    max-width: 1200px;
    margin: 0 auto;
    border-inline: 1px solid var(--border);
    background: var(--bg);
  }

  .app-shell__header {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--border);
  }

  .app-shell__brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .app-shell__logo {
    display: grid;
    place-items: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 10px;
    background: var(--accent-bg);
    color: var(--accent);
    font-weight: 700;
    font-size: 1.1rem;
  }

  .app-shell__title {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-h);
  }

  .app-shell__subtitle {
    margin: 0.1rem 0 0;
    font-size: 0.8rem;
    color: var(--text);
  }

  .app-shell__body {
    display: grid;
    grid-template-columns: 200px 1fr;
    flex: 1;
    min-height: 0;
  }

  .app-shell__nav {
    padding: 1rem 0.75rem;
    border-right: 1px solid var(--border);
  }

  .app-shell__nav ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .app-shell__main {
    padding: 1.25rem 1.5rem 2rem;
    min-width: 0;
  }

  @media (max-width: 768px) {
    .app-shell__body {
      grid-template-columns: 1fr;
    }

    .app-shell__nav {
      border-right: none;
      border-bottom: 1px solid var(--border);
    }

    .app-shell__nav ul {
      flex-direction: row;
      flex-wrap: wrap;
    }
  }
</style>
