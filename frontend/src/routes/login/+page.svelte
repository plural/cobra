<script lang="ts">
  import { onMount } from "svelte";
  import { authStore } from "$lib/utils/auth.svelte";
  import FontAwesomeIcon from "$lib/components/FontAwesomeIcon.svelte";

  let returnTo = $state("/tournaments/my");

  onMount(async () => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      returnTo = urlParams.get("return_to") || "/tournaments/my";
    }

    const user = await authStore.checkAuth();
    if (user && typeof window !== "undefined") {
      window.location.href = returnTo;
    }
  });
</script>

<div class="container mt-5">
  <div class="row justify-content-center">
    <div class="col-md-6">
      <div class="card shadow-sm text-center">
        <div class="card-header bg-dark text-white">
          <h4 class="mb-0">Sign in to Cobra</h4>
        </div>
        <div class="card-body p-4">
          <p class="text-muted mb-4">
            Cobra uses NetrunnerDB accounts for authentication and deck registration.
          </p>

          {#if authStore.isLoading}
            <div class="spinner-border text-primary" role="status">
              <span class="sr-only">Checking authentication...</span>
            </div>
          {:else}
            <a
              href={`/login?return_to=${encodeURIComponent(returnTo)}`}
              class="btn btn-primary btn-lg btn-block mb-3"
            >
              <FontAwesomeIcon icon="sign-in" /> Sign in with NetrunnerDB
            </a>

            <p class="small text-muted mt-3 mb-0">
              Don't have a NetrunnerDB account?
              <a href="https://netrunnerdb.com/register/" target="_blank" rel="noreferrer">
                Register on NetrunnerDB
              </a>
            </p>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>
