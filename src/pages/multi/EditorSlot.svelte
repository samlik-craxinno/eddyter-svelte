<script lang="ts">
  import { Eddyter } from '@eddyter/svelte'
  import { EDDYTER_API_KEY } from '../../lib/config'
  import { createLifecycleHandlers } from '../../lib/lifecycle/createLifecycleHandlers'

  interface Props {
    label: string
    slotId: string
    initialHtml: string
    maxHeight?: string
  }

  let { label, slotId, initialHtml, maxHeight = '280px' }: Props = $props()

  let html = $state(initialHtml)
  const lifecycle = createLifecycleHandlers(`MultiEditors:${slotId}`)
</script>

<section class="editor-slot">
  <h2 class="editor-slot__title">{label}</h2>

  <Eddyter
    apiKey={EDDYTER_API_KEY}
    value={html}
    mode="edit"
    className="editor-slot__eddyter"
    toolbar={{ mode: 'static' }}
    editor={{ maxHeight }}
    onChange={(value) => {
      html = value
      lifecycle.onChange(value)
    }}
    onReady={lifecycle.onReady}
    onFocus={lifecycle.onFocus}
    onBlur={lifecycle.onBlur}
    onAuthSuccess={lifecycle.onAuthSuccess}
    onAuthError={lifecycle.onAuthError}
  />

  <h3 class="editor-slot__preview-label">Preview</h3>
  <div class="editor-slot__preview">{@html html}</div>
</section>

<style>
  .editor-slot {
    margin-bottom: 2rem;
    min-width: 0;
  }

  .editor-slot:last-child {
    margin-bottom: 0;
  }

  .editor-slot__title {
    font-size: 1.1rem;
    margin: 0 0 0.5rem;
    color: var(--text-h);
  }

  :global(.editor-slot__eddyter) {
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
  }

  .editor-slot__preview-label {
    font-size: 0.875rem;
    font-weight: 600;
    margin: 0.75rem 0 0.35rem;
    color: var(--text-h);
  }

  .editor-slot__preview {
    min-height: 120px;
    padding: 0.65rem 0.85rem;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--code-bg);
    color: var(--text-h);
    overflow: auto;
  }

  .editor-slot__preview :global(p) {
    margin: 0.4em 0;
  }

  .editor-slot__preview :global(p:first-child) {
    margin-top: 0;
  }
</style>
