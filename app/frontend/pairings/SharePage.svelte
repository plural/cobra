<script lang="ts">
  import FontAwesomeIcon from "../widgets/FontAwesomeIcon.svelte";
  import ProgressButton from "../widgets/ProgressButton.svelte";

  interface Props {
    text: string;
    page: number;
  }

  let { text, page }: Props = $props();

  let error = $state("");

  async function copyMarkdown() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      error = "Unable to copy text.";
    }
  }
</script>

<h3>Page {page}</h3>

<textarea readonly={true}>{text}</textarea>

<span>
  <ProgressButton
    css="btn btn-info align-top"
    inProgressText="Copying"
    completeText="Copied"
    onclick={copyMarkdown}
  >
    <FontAwesomeIcon icon="copy" /> Copy
  </ProgressButton>
  {#if error}
    <div class="alert alert-danger">{error}</div>
  {/if}
</span>
