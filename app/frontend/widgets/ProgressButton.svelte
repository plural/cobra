<script lang="ts">
  import type { Snippet } from "svelte";
  import FontAwesomeIcon from "./FontAwesomeIcon.svelte";

  const State = Object.freeze({
    DEFAULT: 0,
    IN_PROGRESS: 1,
    COMPLETE: 2,
  });
  const COMPLETE_DURATION = 1000;

  let {
    css = "btn btn-info",
    children,
    inProgressText,
    completeText,
    confirm,
    onclick,
  }: {
    css?: string;
    children: Snippet;
    inProgressText: string;
    completeText: string;
    confirm?: () => boolean;
    onclick: () => Promise<void>;
  } = $props();

  let state: number = $state(State.DEFAULT);

  async function clicked() {
    if (state !== State.DEFAULT || (confirm !== undefined && !confirm())) {
      return;
    }

    state = State.IN_PROGRESS;
    await onclick();
    state = State.COMPLETE;

    setTimeout(() => {
      state = State.DEFAULT;
    }, COMPLETE_DURATION);
  }
</script>

<button type="button" class={css} onclick={clicked}>
  {#if state === State.IN_PROGRESS}
    <span class="spinner-border spinner-border-sm m-auto"></span>
    {inProgressText}
  {:else if state === State.COMPLETE}
    <FontAwesomeIcon icon="check" /> {completeText}
  {:else}
    {@render children()}
  {/if}
</button>
