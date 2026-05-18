<script lang="ts">
  import { onMount } from 'svelte'
  import { Eddyter } from 'richtext-core-svelte'
  import { EDDYTER_API_KEY } from '../../lib/config'
  import { createLifecycleHandlers } from '../../lib/lifecycle/createLifecycleHandlers'

  interface Props {
    toolbarMode: 'sticky' | 'static'
    maxHeight: string
    onLifecycle?: (event: 'mounted' | 'destroyed') => void
  }

  let { toolbarMode, maxHeight, onLifecycle }: Props = $props()

  let content = $state('<p>Editor initialized when the modal opened.</p>')

  const lifecycle = createLifecycleHandlers('ModalEditor', (phase, detail) => {
    if (detail === undefined) {
      console.log(`[ModalEditor] ${phase}`)
    } else {
      console.log(`[ModalEditor] ${phase}`, detail)
    }
  })

  const toolbar =
    toolbarMode === 'sticky'
      ? { mode: 'sticky' as const, offset: 10, zIndex: 1000 }
      : { mode: 'static' as const }

  onMount(() => {
    onLifecycle?.('mounted')
    return () => onLifecycle?.('destroyed')
  })
</script>

<div class="modal-editor-content">
  <Eddyter
    apiKey={EDDYTER_API_KEY}
    value={content}
    mode="edit"
    className="modal-editor-content__eddyter-wrap"
    {toolbar}
    editor={{ maxHeight }}
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

  <h3 class="modal-editor-content__preview-label">Preview</h3>
  <div class="modal-editor-content__preview">{@html content}</div>
</div>

<style>
  :global(.modal-editor-content__eddyter-wrap) {
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
    background: var(--bg);
  }

  .modal-editor-content__preview-label {
    margin: 0.75rem 0 0.35rem;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-h);
  }

  .modal-editor-content__preview {
    min-height: 72px;
    max-height: 120px;
    overflow: auto;
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--code-bg);
    color: var(--text-h);
    font-size: 0.9rem;
  }

  .modal-editor-content__preview :global(p) {
    margin: 0.35em 0;
  }
</style>
