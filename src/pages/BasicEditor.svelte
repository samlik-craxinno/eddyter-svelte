<script lang="ts">
  import { onMount } from 'svelte'
  import { Eddyter } from '@eddyter/svelte'
  import { EDDYTER_API_KEY } from '../lib/config'

  const STORAGE_TITLE = 'basic-editor:title'
  const STORAGE_HTML = 'basic-editor:html'
  const STORAGE_DARK = 'basic-editor:dark'

  function loadDarkMode(): boolean {
    if (typeof window === 'undefined') return true
    const stored = localStorage.getItem(STORAGE_DARK)
    if (stored !== null) return stored === 'true'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  function loadDraft(): { title: string; html: string } {
    if (typeof window === 'undefined') {
      return { title: '', html: '<p></p>' }
    }
    return {
      title: localStorage.getItem(STORAGE_TITLE) ?? '',
      html: localStorage.getItem(STORAGE_HTML) ?? '<p></p>',
    }
  }

  const draft = loadDraft()
  let title = $state(draft.title)
  let content = $state(draft.html)
  let isDark = $state(loadDarkMode())
  let lastSaved = $state<Date | null>(null)

  function toggleDarkMode() {
    isDark = !isDark
    localStorage.setItem(STORAGE_DARK, String(isDark))
  }

  let saveTimer: ReturnType<typeof setTimeout> | null = null

  function persist() {
    localStorage.setItem(STORAGE_TITLE, title)
    localStorage.setItem(STORAGE_HTML, content)
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
    title
    content
    scheduleAutosave()
  })

  onMount(() => {
    return () => {
      if (saveTimer !== null) clearTimeout(saveTimer)
      persist()
    }
  })
</script>

<div class="basic-editor">
  <header class="basic-editor__header">
    <div class="basic-editor__heading-row">
      <h1 class="basic-editor__title">Basic editor</h1>
      <div class="basic-editor__heading-actions">
        <button
          type="button"
          class="basic-editor__theme-toggle"
          aria-pressed={isDark}
          onclick={toggleDarkMode}
        >
          {isDark ? 'Light mode' : 'Dark mode'}
        </button>
        {#if lastSaved}
          <span class="basic-editor__saved" title={lastSaved.toISOString()}>
            Saved {lastSaved.toLocaleTimeString()}
          </span>
        {/if}
      </div>
    </div>

    <label class="basic-editor__label">
      <span class="basic-editor__label-text">Title</span>
      <input
        bind:value={title}
        type="text"
        class="basic-editor__input"
        placeholder="Document title"
        autocomplete="off"
      />
    </label>
  </header>

  <div class="basic-editor__grid">
    <section class="basic-editor__panel">
      <h2 class="basic-editor__panel-title">Editor</h2>
      <Eddyter
        apiKey={EDDYTER_API_KEY}
        value={content}
        mode="edit"
        darkMode={isDark}
        className="basic-editor__eddyter"
        editorClass="basic-editor__eddyter-inner"
        toolbar={{ mode: 'static' }}
        editor={{ maxHeight: '420px' }}
        onChange={(html) => {
          content = html
        }}
      />
    </section>

    <section class="basic-editor__panel">
      <h2 class="basic-editor__panel-title">Live HTML preview</h2>
      <div class="basic-editor__preview">
        {@html content}
      </div>
    </section>
  </div>
</div>

<style>
  .basic-editor__header {
    margin-bottom: 1.5rem;
  }

  .basic-editor__heading-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }

  .basic-editor__title {
    font-size: 1.75rem;
    margin: 0;
    color: var(--text-h);
  }

  .basic-editor__heading-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .basic-editor__theme-toggle {
    padding: 0.45rem 0.85rem;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--bg);
    color: var(--text-h);
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    white-space: nowrap;
  }

  .basic-editor__theme-toggle:hover {
    border-color: var(--accent-border);
    background: var(--accent-bg);
  }

  .basic-editor__theme-toggle:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  .basic-editor__saved {
    font-size: 0.8rem;
    color: var(--text);
  }

  .basic-editor__label {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .basic-editor__label-text {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-h);
  }

  .basic-editor__input {
    font: inherit;
    padding: 0.5rem 0.65rem;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--bg);
    color: var(--text-h);
  }

  .basic-editor__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  @media (min-width: 900px) {
    .basic-editor__grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  .basic-editor__panel {
    min-width: 0;
  }

  .basic-editor__panel-title {
    font-size: 1rem;
    margin: 0 0 0.5rem;
    color: var(--text-h);
  }

  :global(.basic-editor__eddyter) {
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
  }

  .basic-editor__preview {
    min-height: 200px;
    padding: 0.75rem 1rem;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--code-bg);
    color: var(--text-h);
    overflow: auto;
  }

  .basic-editor__preview :global(p) {
    margin: 0.5em 0;
  }

  .basic-editor__preview :global(p:first-child) {
    margin-top: 0;
  }
</style>
