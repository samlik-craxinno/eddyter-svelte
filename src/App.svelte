<script lang="ts">
  import { onMount } from 'svelte'
  import AppLayout from './lib/layout/AppLayout.svelte'
  import { parseRoute, routePath, type RouteId } from './lib/router'
  import BasicEditor from './pages/BasicEditor.svelte'
  import MultiEditors from './pages/MultiEditors.svelte'
  import LifecyclePage from './pages/LifecyclePage.svelte'
  import CommentsFeed from './pages/CommentsFeed.svelte'
  import ModalEditor from './pages/ModalEditor.svelte'

  function readRoute(): RouteId {
    return parseRoute(window.location.pathname)
  }

  let route = $state<RouteId>(readRoute())

  function navigate(next: RouteId, replace = false) {
    const path = routePath(next)
    if (window.location.pathname !== path) {
      if (replace) {
        history.replaceState(null, '', path)
      } else {
        history.pushState(null, '', path)
      }
    }
    route = next
  }

  onMount(() => {
    // Redirect legacy hash URLs and /basic to clean paths
    if (window.location.hash.startsWith('#/')) {
      const legacyPath = window.location.hash.slice(1)
      const next = parseRoute(legacyPath === '/basic' ? '/' : legacyPath)
      navigate(next, true)
      return
    }

    if (window.location.pathname === '/basic') {
      navigate('basic', true)
    } else {
      route = readRoute()
    }

    const onPopState = () => {
      route = readRoute()
    }

    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  })
</script>

<AppLayout {route} {navigate}>
  {#if route === 'basic'}
    <BasicEditor />
  {:else if route === 'multi'}
    <MultiEditors />
  {:else if route === 'comments'}
    <CommentsFeed />
  {:else if route === 'modal'}
    <ModalEditor />
  {:else}
    <LifecyclePage />
  {/if}
</AppLayout>
