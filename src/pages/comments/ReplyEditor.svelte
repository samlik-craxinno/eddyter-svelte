<script lang="ts">
  import { onMount } from 'svelte'
  import { Eddyter } from 'richtext-core-svelte'
  import { EDDYTER_API_KEY } from '../../lib/config'
  import {
    createLifecycleHandlers,
    type LifecycleLogFn,
  } from '../../lib/lifecycle/createLifecycleHandlers'

  interface Props {
    postId: string
    onCancel: () => void
    onLifecycle?: LifecycleLogFn
    onHostLifecycle?: (event: 'mounted' | 'destroyed', postId: string) => void
  }

  let { postId, onCancel, onLifecycle, onHostLifecycle }: Props = $props()

  function draftKey(id: string) {
    return `comments:draft:${id}`
  }

  let html = $state('<p></p>')
  let lastSaved = $state<Date | null>(null)
  let saveTimer: ReturnType<typeof setTimeout> | null = null

  const lifecycle = createLifecycleHandlers(`Reply:${postId}`, (phase, detail) => {
    onLifecycle?.(phase, detail)
  })

  function persist() {
    localStorage.setItem(draftKey(postId), html)
    lastSaved = new Date()
  }

  function scheduleAutosave() {
    if (saveTimer !== null) clearTimeout(saveTimer)
    saveTimer = setTimeout(() => {
      persist()
      saveTimer = null
    }, 400)
  }

  $effect(() => {
    html
    scheduleAutosave()
  })

  function handleCancel() {
    onCancel()
  }

  onMount(() => {
    const saved = localStorage.getItem(draftKey(postId))
    if (saved) {
      html = saved
    }
    onHostLifecycle?.('mounted', postId)

    return () => {
      if (saveTimer !== null) clearTimeout(saveTimer)
      persist()
      onHostLifecycle?.('destroyed', postId)
    }
  })
</script>

<div class="reply-editor">
  <div class="reply-editor__toolbar">
    <span class="reply-editor__label">Replying</span>
    {#if lastSaved}
      <span class="reply-editor__saved">Draft saved {lastSaved.toLocaleTimeString()}</span>
    {/if}
  </div>

  <Eddyter
    apiKey={EDDYTER_API_KEY}
    value={html}
    mode="edit"
    className="reply-editor__eddyter"
    toolbar={{ mode: 'static' }}
    editor={{ maxHeight: '200px' }}
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

  <h4 class="reply-editor__preview-title">Reply preview</h4>
  <div class="reply-editor__preview">
    {#if html.replace(/<[^>]*>/g, '').trim()}
      {@html html}
    {:else}
      <p class="reply-editor__preview-empty">Nothing to preview yet.</p>
    {/if}
  </div>

  <div class="reply-editor__actions">
    <button type="button" class="reply-editor__btn reply-editor__btn--ghost" onclick={handleCancel}>
      Cancel
    </button>
  </div>
</div>

<style>
  .reply-editor {
    margin-top: 0.75rem;
    padding: 0.85rem;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--code-bg);
  }

  .reply-editor__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    flex-wrap: wrap;
  }

  .reply-editor__label {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-h);
  }

  .reply-editor__saved {
    font-size: 0.75rem;
    color: var(--text);
  }

  :global(.reply-editor__eddyter) {
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
    background: var(--bg);
  }

  .reply-editor__preview-title {
    margin: 0.65rem 0 0.35rem;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-h);
  }

  .reply-editor__preview {
    min-height: 64px;
    padding: 0.5rem 0.65rem;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--bg);
    color: var(--text-h);
    font-size: 0.9rem;
  }

  .reply-editor__preview-empty {
    margin: 0;
    color: var(--text);
    font-style: italic;
    font-size: 0.85rem;
  }

  .reply-editor__preview :global(p) {
    margin: 0.35em 0;
  }

  .reply-editor__actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.65rem;
  }

  .reply-editor__btn {
    font: inherit;
    padding: 0.4rem 0.85rem;
    border-radius: 8px;
    cursor: pointer;
    border: 1px solid var(--border);
  }

  .reply-editor__btn--ghost {
    background: var(--bg);
    color: var(--text-h);
  }

  .reply-editor__btn--ghost:hover {
    background: var(--accent-bg);
  }
</style>
