<script lang="ts">
  import EditorSlot from './multi/EditorSlot.svelte'
</script>

<div class="multi-editors">
  <header class="multi-editors__header">
    <h1 class="multi-editors__title">Multi editors</h1>
    <p class="multi-editors__lede">
      Three independent Eddyter instances — excerpt, content, and SEO. Each has its own
      HTML state, lifecycle callbacks, and preview panel.
    </p>
  </header>

  <EditorSlot
    label="Excerpt"
    slotId="excerpt"
    initialHtml="<p><em>Excerpt</em> — short summary for listings.</p>"
    maxHeight="260px"
  />

  <EditorSlot
    label="Content"
    slotId="content"
    initialHtml="<p><strong>Content</strong> — main article body.</p>"
    maxHeight="320px"
  />

  <EditorSlot
    label="SEO"
    slotId="seo"
    initialHtml="<p>SEO — meta description and structured notes.</p>"
    maxHeight="220px"
  />
</div>

<style>
  .multi-editors__header {
    margin-bottom: 2rem;
  }

  .multi-editors__title {
    font-size: 1.75rem;
    margin: 0 0 0.5rem;
    color: var(--text-h);
  }

  .multi-editors__lede {
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.45;
    color: var(--text);
  }
</style>
