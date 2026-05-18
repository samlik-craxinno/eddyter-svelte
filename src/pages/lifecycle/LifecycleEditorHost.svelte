<script lang="ts">
  import { onMount } from 'svelte'
  import { Eddyter } from 'richtext-core-svelte'
  import { EDDYTER_API_KEY } from '../../lib/config'
  import {
    createLifecycleHandlers,
    type LifecycleLogFn,
  } from '../../lib/lifecycle/createLifecycleHandlers'

  interface Props {
    onHostMounted?: () => void
    onHostUnmounting?: () => void
    onEditorLog?: LifecycleLogFn
  }

  let { onHostMounted, onHostUnmounting, onEditorLog }: Props = $props()

  let content = $state(
    '<p>Editor inside dynamic host — toggle visibility or recreate to test lifecycle.</p>',
  )

  const lifecycle = createLifecycleHandlers('LifecycleEditor', (phase, detail) => {
    onEditorLog?.(phase, detail)
  })

  onMount(() => {
    onHostMounted?.()
    return () => {
      onHostUnmounting?.()
    }
  })
</script>

<div class="lifecycle-host">
  <Eddyter
    apiKey={EDDYTER_API_KEY}
    value={content}
    mode="edit"
    className="lifecycle-host__eddyter"
    toolbar={{ mode: 'sticky' }}
    editor={{ maxHeight: '280px' }}
    onChange={(html) => {
      content = html
      lifecycle.onChange(html)
    }}
    onReady={lifecycle.onReady}
    onFocus={lifecycle.onFocus}
    onBlur={lifecycle.onBlur}
    onAuthSuccess={lifecycle.onAuthSuccess}
    onAuthError={lifecycle.onAuthError}
  />
  <p class="lifecycle-host__hint">Preview (same model)</p>
  <div class="lifecycle-host__preview">{@html content}</div>
</div>

<style>
  .lifecycle-host {
    min-width: 0;
  }

  :global(.lifecycle-host__eddyter) {
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
  }

  .lifecycle-host__hint {
    margin: 0.65rem 0 0.25rem;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-h);
  }

  .lifecycle-host__preview {
    min-height: 72px;
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--code-bg);
    color: var(--text-h);
    font-size: 0.9rem;
  }

  .lifecycle-host__preview :global(p) {
    margin: 0.35em 0;
  }
</style>
