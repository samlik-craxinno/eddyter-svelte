<script lang="ts">
  import { onMount } from 'svelte'
  import ModalEditorContent from './modal/ModalEditorContent.svelte'

  let open = $state(false)
  let toolbarMode = $state<'sticky' | 'static'>('sticky')
  let maxHeight = $state('320px')
  let mountCount = $state(0)
  let destroyCount = $state(0)
  let logs = $state<string[]>([])

  const maxHeightOptions = ['200px', '320px', '480px'] as const

  function pushLog(line: string) {
    const stamp = new Date().toISOString().slice(11, 23)
    logs = [...logs, `${stamp}  ${line}`].slice(-100)
  }

  function openModal() {
    open = true
    pushLog('[Modal] opened — mounting editor')
  }

  function closeModal() {
    open = false
    pushLog('[Modal] closed — destroying editor')
  }

  function onEditorLifecycle(event: 'mounted' | 'destroyed') {
    if (event === 'mounted') {
      mountCount += 1
      pushLog(`[Modal] Eddyter mounted (total: ${mountCount})`)
    } else {
      destroyCount += 1
      pushLog(`[Modal] Eddyter destroyed (total: ${destroyCount})`)
    }
  }

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) closeModal()
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && open) closeModal()
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  })
</script>

<div class="modal-page">
  <header class="modal-page__header">
    <h1 class="modal-page__title">Modal editor</h1>
    <p class="modal-page__lede">
      The Eddyter instance is created only while the modal is open. Closing the modal
      unmounts the editor and calls <code>destroy()</code> on the SDK instance.
    </p>
  </header>

  <section class="modal-page__controls">
    <h2 class="modal-page__section-title">Toolbar &amp; scrolling</h2>

    <fieldset class="modal-page__fieldset">
      <legend>Toolbar mode</legend>
      <label class="modal-page__radio">
        <input
          type="radio"
          name="toolbar-mode"
          value="sticky"
          checked={toolbarMode === 'sticky'}
          onchange={() => (toolbarMode = 'sticky')}
        />
        Sticky
      </label>
      <label class="modal-page__radio">
        <input
          type="radio"
          name="toolbar-mode"
          value="static"
          checked={toolbarMode === 'static'}
          onchange={() => (toolbarMode = 'static')}
        />
        Static
      </label>
    </fieldset>

    <label class="modal-page__select-label">
      <span>Editor max height (scrollable content)</span>
      <select bind:value={maxHeight}>
        {#each maxHeightOptions as option}
          <option value={option}>{option}</option>
        {/each}
      </select>
    </label>
  </section>

  <dl class="modal-page__stats">
    <div>
      <dt>Modal</dt>
      <dd>{open ? 'open' : 'closed'}</dd>
    </div>
    <div>
      <dt>Toolbar</dt>
      <dd>{toolbarMode}</dd>
    </div>
    <div>
      <dt>Max height</dt>
      <dd>{maxHeight}</dd>
    </div>
    <div>
      <dt>Mount count</dt>
      <dd>{mountCount}</dd>
    </div>
    <div>
      <dt>Destroy count</dt>
      <dd>{destroyCount}</dd>
    </div>
  </dl>

  <button type="button" class="modal-page__open-btn" onclick={openModal} disabled={open}>
    Open modal editor
  </button>

  {#if open}
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div
      class="modal-page__backdrop"
      role="presentation"
      onclick={handleBackdropClick}
    >
      <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_noninteractive_element_interactions -->
      <div class="modal-page__dialog" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <header class="modal-page__dialog-header">
          <h2 id="modal-title" class="modal-page__dialog-title">Edit in modal</h2>
          <button
            type="button"
            class="modal-page__close-btn"
            aria-label="Close modal"
            onclick={closeModal}
          >
            ×
          </button>
        </header>

        <div class="modal-page__dialog-body">
          {#key `${toolbarMode}-${maxHeight}`}
            <ModalEditorContent
              {toolbarMode}
              {maxHeight}
              onLifecycle={onEditorLifecycle}
            />
          {/key}
        </div>

        <footer class="modal-page__dialog-footer">
          <button type="button" class="modal-page__footer-btn" onclick={closeModal}>
            Close
          </button>
        </footer>
      </div>
    </div>
  {/if}

  <section class="modal-page__log-section">
    <h2 class="modal-page__section-title">Lifecycle log</h2>
    <ol class="modal-page__log">
      {#each [...logs].reverse() as line, i (logs.length - i)}
        <li>{line}</li>
      {/each}
      {#if logs.length === 0}
        <li class="modal-page__log-empty">Open the modal to see mount/destroy events.</li>
      {/if}
    </ol>
  </section>
</div>

<style>
  .modal-page__header {
    margin-bottom: 1.25rem;
  }

  .modal-page__title {
    font-size: 1.75rem;
    margin: 0 0 0.5rem;
    color: var(--text-h);
  }

  .modal-page__lede {
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.45;
    color: var(--text);
  }

  .modal-page__section-title {
    font-size: 1rem;
    margin: 0 0 0.65rem;
    color: var(--text-h);
  }

  .modal-page__controls {
    margin-bottom: 1.25rem;
    padding: 1rem;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--code-bg);
  }

  .modal-page__fieldset {
    border: none;
    margin: 0 0 0.85rem;
    padding: 0;
  }

  .modal-page__fieldset legend {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-h);
    margin-bottom: 0.35rem;
  }

  .modal-page__radio {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    margin-right: 1rem;
    font-size: 0.9rem;
    color: var(--text-h);
    cursor: pointer;
  }

  .modal-page__select-label {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-h);
  }

  .modal-page__select-label select {
    font: inherit;
    padding: 0.4rem 0.5rem;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--bg);
    color: var(--text-h);
    max-width: 12rem;
  }

  .modal-page__stats {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 0.75rem;
    margin: 0 0 1.25rem;
    padding: 0.75rem 1rem;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--bg);
  }

  .modal-page__stats dt {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--text);
  }

  .modal-page__stats dd {
    margin: 0.1rem 0 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-h);
  }

  .modal-page__open-btn {
    font: inherit;
    padding: 0.55rem 1.1rem;
    border-radius: 8px;
    border: 1px solid var(--accent-border);
    background: var(--accent-bg);
    color: var(--accent);
    font-weight: 600;
    cursor: pointer;
  }

  .modal-page__open-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .modal-page__backdrop {
    position: fixed;
    inset: 0;
    z-index: 500;
    display: grid;
    place-items: center;
    padding: 1rem;
    background: rgba(8, 6, 13, 0.55);
  }

  .modal-page__dialog {
    width: min(720px, 100%);
    max-height: min(90svh, 720px);
    display: flex;
    flex-direction: column;
    border-radius: 12px;
    border: 1px solid var(--border);
    background: var(--bg);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
  }

  .modal-page__dialog-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.85rem 1rem;
    border-bottom: 1px solid var(--border);
  }

  .modal-page__dialog-title {
    margin: 0;
    font-size: 1.1rem;
    color: var(--text-h);
  }

  .modal-page__close-btn {
    font: inherit;
    font-size: 1.5rem;
    line-height: 1;
    width: 2rem;
    height: 2rem;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: var(--text);
    cursor: pointer;
  }

  .modal-page__close-btn:hover {
    background: var(--code-bg);
    color: var(--text-h);
  }

  .modal-page__dialog-body {
    padding: 1rem;
    overflow: auto;
    min-height: 0;
  }

  .modal-page__dialog-footer {
    padding: 0.75rem 1rem;
    border-top: 1px solid var(--border);
    display: flex;
    justify-content: flex-end;
  }

  .modal-page__footer-btn {
    font: inherit;
    padding: 0.45rem 0.9rem;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: var(--bg);
    color: var(--text-h);
    cursor: pointer;
  }

  .modal-page__log-section {
    margin-top: 2rem;
  }

  .modal-page__log {
    margin: 0;
    padding: 0.75rem 0.75rem 0.75rem 1.5rem;
    max-height: 200px;
    overflow: auto;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--bg);
    font-family: ui-monospace, Consolas, monospace;
    font-size: 0.8rem;
    line-height: 1.45;
  }

  .modal-page__log li {
    margin-bottom: 0.2rem;
  }

  .modal-page__log-empty {
    list-style: none;
    margin-left: -1.5rem;
    color: var(--text);
    font-style: italic;
  }
</style>
