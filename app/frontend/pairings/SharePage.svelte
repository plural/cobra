<script lang="ts">
  import { fade } from "svelte/transition";
  import FontAwesomeIcon from "../widgets/FontAwesomeIcon.svelte";

  const FADE_DURATION = 1000;

  interface Props {
    text: string;
    page: number;
  }

  let { text, page }: Props = $props();

  let showCopy = $state(true);
  let showCopied = $state(false);
  let error = $state("");

  async function copyMarkdown(e: MouseEvent) {
    e.preventDefault();

    try {
      await navigator.clipboard.writeText(text);

      showCopy = false;
      showCopied = true;
      setTimeout(() => (showCopied = false), 1);
      setTimeout(() => {
        showCopy = true;
      }, FADE_DURATION);
    } catch {
      error = "Unable to copy text.";
    }
  }
</script>

{#if page !== undefined}
  <h3>Page {page}</h3>
{/if}

<textarea readonly={true}>{text}</textarea>

<span>
  <button
    onclick={(e) => {
      void copyMarkdown(e);
    }}
    class="btn btn-info align-top"
  >
    {#if showCopy}
      <div><FontAwesomeIcon icon="copy" /> Copy</div>
    {/if}
    {#if showCopied}
      <div out:fade={{ duration: FADE_DURATION }}>
        <FontAwesomeIcon icon="check" /> Copied
      </div>
    {/if}
  </button>
  {#if error}
    <div class="alert alert-danger">{error}</div>
  {/if}
</span>
