<script lang="ts">
  import { onMount } from 'svelte'
  import LifecycleEditorHost from './lifecycle/LifecycleEditorHost.svelte'
  import type { LifecyclePhase } from '../lib/lifecycle/createLifecycleHandlers'

  let visible = $state(true)
  let editorKey = $state(0)
  let mountCount = $state(0)
  let destroyCount = $state(0)
  let logs = $state<string[]>([])

  function pushLog(line: string) {
    const stamp = new Date().toISOString().slice(11, 23)
    logs = [...logs, `${stamp}  ${line}`].slice(-200)
  }

  function showEditor() {
    visible = true
  }

  function hideEditor() {
    visible = false
  }

  function recreateEditor() {
    editorKey += 1
  }

  function onHostMounted() {
    mountCount += 1
    pushLog(`[Lifecycle] editor host mounted (total mounts: ${mountCount})`)
  }

  function onHostUnmounting() {
    destroyCount += 1
    pushLog(`[Lifecycle] editor host onDestroy (total destroys: ${destroyCount})`)
  }

  function onEditorLog(phase: LifecyclePhase, detail?: string) {
    if (detail === undefined) {
      pushLog(`[Lifecycle] ${phase}`)
      return
    }
    pushLog(`[Lifecycle] ${phase} (${detail})`)
  }

  onMount(() => {
    pushLog('[Lifecycle] page onMount')
    return () => pushLog('[Lifecycle] page onDestroy')
  })
</script>

<div class="lifecycle-page">
  <header class="lifecycle-page__header">
    <h1 class="lifecycle-page__title">Lifecycle</h1>
    <p class="lifecycle-page__lede">
      Toggle visibility or change the editor <code>key</code> to recreate the subtree.
      Lifecycle callbacks (<code>onReady</code>, <code>onFocus</code>, <code>onBlur</code>,
      <code>onChange</code>, <code>onAuthSuccess</code>, <code>onAuthError</code>) are
      logged below and in the browser console.
    </p>
  </header>

  <div class="lifecycle-page__toolbar">
    <button type="button" class="lifecycle-page__btn" onclick={showEditor}>
      Show Editor
    </button>
    <button type="button" class="lifecycle-page__btn" onclick={hideEditor}>
      Hide Editor
    </button>
    <button
      type="button"
      class="lifecycle-page__btn lifecycle-page__btn--accent"
      onclick={recreateEditor}
    >
      Recreate Editor
    </button>
  </div>

  <dl class="lifecycle-page__stats">
    <div>
      <dt>Mount count</dt>
      <dd>{mountCount}</dd>
    </div>
    <div>
      <dt>Destroy count</dt>
      <dd>{destroyCount}</dd>
    </div>
    <div>
      <dt>Visible</dt>
      <dd>{visible ? 'yes' : 'no'}</dd>
    </div>
    <div>
      <dt>Editor key</dt>
      <dd>{editorKey}</dd>
    </div>
  </dl>

  <section class="lifecycle-page__editor-slot">
    <h2 class="lifecycle-page__section-title">Editor slot</h2>
    {#if !visible}
      <p class="lifecycle-page__placeholder">Editor hidden</p>
    {:else}
      {#key editorKey}
        <LifecycleEditorHost
          {onHostMounted}
          {onHostUnmounting}
          {onEditorLog}
        />
      {/key}
    {/if}
  </section>

  <section class="lifecycle-page__log-section">
    <h2 class="lifecycle-page__section-title">Lifecycle logs</h2>
    <ol class="lifecycle-page__log">
      {#each [...logs].reverse() as line, i (logs.length - i)}
        <li>{line}</li>
      {/each}
    </ol>
  </section>
</div>

<style>
  .lifecycle-page__header {
    margin-bottom: 1.25rem;
  }

  .lifecycle-page__title {
    font-size: 1.75rem;
    margin: 0 0 0.5rem;
    color: var(--text-h);
  }

  .lifecycle-page__lede {
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.45;
    color: var(--text);
  }

  .lifecycle-page__lede code {
    font-size: 0.85em;
  }

  .lifecycle-page__toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .lifecycle-page__btn {
    font: inherit;
    padding: 0.45rem 0.85rem;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: var(--bg);
    color: var(--text-h);
    cursor: pointer;
  }

  .lifecycle-page__btn:hover {
    filter: brightness(0.97);
  }

  .lifecycle-page__btn--accent {
    border-color: var(--accent-border);
    background: var(--accent-bg);
  }

  .lifecycle-page__stats {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 0.75rem 1rem;
    margin: 0 0 1.25rem;
    padding: 0.75rem 1rem;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--code-bg);
  }

  .lifecycle-page__stats dt {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--text);
  }

  .lifecycle-page__stats dd {
    margin: 0.15rem 0 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-h);
  }

  .lifecycle-page__editor-slot {
    margin-bottom: 1.5rem;
    min-width: 0;
  }

  .lifecycle-page__section-title {
    font-size: 1.05rem;
    margin: 0 0 0.5rem;
    color: var(--text-h);
  }

  .lifecycle-page__placeholder {
    margin: 0;
    padding: 1rem;
    border: 1px dashed var(--border);
    border-radius: 8px;
    color: var(--text);
    font-size: 0.9rem;
  }

  .lifecycle-page__log {
    margin: 0;
    padding: 0.75rem 0.75rem 0.75rem 1.5rem;
    max-height: 320px;
    overflow: auto;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--bg);
    font-family: ui-monospace, Consolas, monospace;
    font-size: 0.8rem;
    line-height: 1.45;
  }

  .lifecycle-page__log li {
    margin-bottom: 0.25rem;
  }
</style>
