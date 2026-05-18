<script lang="ts">
  import { FAKE_POSTS } from '../lib/comments/posts'
  import type { LifecyclePhase } from '../lib/lifecycle/createLifecycleHandlers'
  import ReplyEditor from './comments/ReplyEditor.svelte'

  let activeReplies = $state<string[]>([])
  let mountCount = $state(0)
  let destroyCount = $state(0)
  let logs = $state<string[]>([])

  function pushLog(line: string) {
    const stamp = new Date().toISOString().slice(11, 23)
    logs = [...logs, `${stamp}  ${line}`].slice(-200)
  }

  function isReplyOpen(postId: string) {
    return activeReplies.includes(postId)
  }

  function openReply(postId: string) {
    if (isReplyOpen(postId)) return
    activeReplies = [...activeReplies, postId]
    pushLog(`[Feed] open reply editor for ${postId}`)
  }

  function cancelReply(postId: string) {
    activeReplies = activeReplies.filter((id) => id !== postId)
    pushLog(`[Feed] cancel — destroying editor for ${postId}`)
  }

  function onHostLifecycle(event: 'mounted' | 'destroyed', postId: string) {
    if (event === 'mounted') {
      mountCount += 1
      pushLog(`[Feed] ReplyEditor mounted (${postId}) — total: ${mountCount}`)
    } else {
      destroyCount += 1
      pushLog(`[Feed] ReplyEditor destroyed (${postId}) — total: ${destroyCount}`)
    }
  }

  function onEditorLifecycle(postId: string, phase: LifecyclePhase, detail?: string) {
    if (detail === undefined) {
      pushLog(`[Feed] ${postId} → ${phase}`)
    } else {
      pushLog(`[Feed] ${postId} → ${phase} (${detail})`)
    }
  }
</script>

<div class="comments-feed">
  <header class="comments-feed__header">
    <h1 class="comments-feed__title">Comments</h1>
    <p class="comments-feed__lede">
      Fake social feed with dynamically mounted reply editors. Open multiple replies at once;
      <strong>Cancel</strong> unmounts and destroys the editor instance.
    </p>
  </header>

  <dl class="comments-feed__stats">
    <div>
      <dt>Active editors</dt>
      <dd>{activeReplies.length}</dd>
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

  <ul class="comments-feed__list">
    {#each FAKE_POSTS as post (post.id)}
      <li class="post-card">
        <div class="post-card__avatar" aria-hidden="true">{post.avatar}</div>
        <div class="post-card__body">
          <div class="post-card__meta">
            <span class="post-card__author">{post.author}</span>
            <span class="post-card__handle">{post.handle}</span>
            <span class="post-card__time">· {post.timeAgo}</span>
          </div>
          <p class="post-card__text">{post.body}</p>

          <div class="post-card__actions">
            {#if isReplyOpen(post.id)}
              <span class="post-card__replying">Replying…</span>
            {:else}
              <button
                type="button"
                class="post-card__reply-btn"
                onclick={() => openReply(post.id)}
              >
                Reply
              </button>
            {/if}
          </div>

          {#if isReplyOpen(post.id)}
            {#key post.id}
              <ReplyEditor
                postId={post.id}
                onCancel={() => cancelReply(post.id)}
                onHostLifecycle={onHostLifecycle}
                onLifecycle={(phase, detail) => onEditorLifecycle(post.id, phase, detail)}
              />
            {/key}
          {/if}
        </div>
      </li>
    {/each}
  </ul>

  <section class="comments-feed__log-section">
    <h2 class="comments-feed__log-title">Lifecycle debug log</h2>
    <ol class="comments-feed__log">
      {#each [...logs].reverse() as line, i (logs.length - i)}
        <li>{line}</li>
      {/each}
      {#if logs.length === 0}
        <li class="comments-feed__log-empty">Open a reply editor to see lifecycle events.</li>
      {/if}
    </ol>
  </section>
</div>

<style>
  .comments-feed__header {
    margin-bottom: 1.25rem;
  }

  .comments-feed__title {
    font-size: 1.75rem;
    margin: 0 0 0.5rem;
    color: var(--text-h);
  }

  .comments-feed__lede {
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.45;
    color: var(--text);
  }

  .comments-feed__stats {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 0.75rem;
    margin: 0 0 1.25rem;
    padding: 0.75rem 1rem;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--code-bg);
  }

  .comments-feed__stats dt {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--text);
  }

  .comments-feed__stats dd {
    margin: 0.15rem 0 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-h);
  }

  .comments-feed__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .post-card {
    display: flex;
    gap: 0.75rem;
    padding: 1rem;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--bg);
  }

  .post-card__avatar {
    flex-shrink: 0;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-size: 0.75rem;
    font-weight: 700;
    background: var(--accent-bg);
    color: var(--accent);
  }

  .post-card__body {
    flex: 1;
    min-width: 0;
  }

  .post-card__meta {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0.35rem;
    margin-bottom: 0.35rem;
  }

  .post-card__author {
    font-weight: 600;
    color: var(--text-h);
  }

  .post-card__handle,
  .post-card__time {
    font-size: 0.85rem;
    color: var(--text);
  }

  .post-card__text {
    margin: 0 0 0.5rem;
    line-height: 1.45;
    color: var(--text-h);
  }

  .post-card__actions {
    margin-bottom: 0.15rem;
  }

  .post-card__reply-btn {
    font: inherit;
    font-size: 0.85rem;
    font-weight: 600;
    padding: 0.25rem 0.5rem;
    border: none;
    border-radius: 6px;
    background: transparent;
    color: var(--accent);
    cursor: pointer;
  }

  .post-card__reply-btn:hover {
    background: var(--accent-bg);
  }

  .post-card__replying {
    font-size: 0.85rem;
    color: var(--text);
  }

  .comments-feed__log-section {
    margin-top: 2rem;
  }

  .comments-feed__log-title {
    font-size: 1.05rem;
    margin: 0 0 0.5rem;
    color: var(--text-h);
  }

  .comments-feed__log {
    margin: 0;
    padding: 0.75rem 0.75rem 0.75rem 1.5rem;
    max-height: 280px;
    overflow: auto;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--bg);
    font-family: ui-monospace, Consolas, monospace;
    font-size: 0.8rem;
    line-height: 1.45;
  }

  .comments-feed__log li {
    margin-bottom: 0.25rem;
  }

  .comments-feed__log-empty {
    list-style: none;
    margin-left: -1.5rem;
    color: var(--text);
    font-style: italic;
  }
</style>
