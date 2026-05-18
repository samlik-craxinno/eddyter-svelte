<script lang="ts">
  import { onMount } from 'svelte'
  import AppLayout from './lib/layout/AppLayout.svelte'
  import { parseRoute, routePath, type RouteId } from './lib/router'
  import BasicEditor from './pages/BasicEditor.svelte'
  import MultiEditors from './pages/MultiEditors.svelte'
  import LifecyclePage from './pages/LifecyclePage.svelte'
  import CommentsFeed from './pages/CommentsFeed.svelte'
  import ModalEditor from './pages/ModalEditor.svelte'

  let route = $state<RouteId>(parseRoute(window.location.hash))

  function navigate(next: RouteId) {
    const path = routePath(next)
    if (window.location.hash !== `#${path}`) {
      window.location.hash = path
    }
    route = next
  }

  onMount(() => {
    if (!window.location.hash || window.location.hash === '#') {
      navigate('basic')
    }

    const onHashChange = () => {
      route = parseRoute(window.location.hash)
    }

    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
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
