<script lang="ts">
  import "$lib/assets/css/application.scss";
  import favicon from "$lib/assets/favicon.ico";
  import { resolve } from "$app/paths";
  import FontAwesomeIcon from "$lib/components/FontAwesomeIcon.svelte";
  import { COBRA_API_SERVER } from "$app/env/public";
  import { authStore } from "$lib/utils/auth.svelte";
  import { onMount } from "svelte";
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();

  const serverOrigin = (COBRA_API_SERVER || "").replace(/\/$/, "");
  let isDropdownOpen = $state(false);

  onMount(() => {
    void authStore.checkAuth();
  });

  function toggleDropdown(e: MouseEvent) {
    e.preventDefault();
    isDropdownOpen = !isDropdownOpen;
  }

  function closeDropdown() {
    isDropdownOpen = false;
  }

  function getLogoutUrl() {
    const returnUrl = typeof window !== "undefined" ? window.location.origin : "/";
    return `${serverOrigin}/logout?return_to=${encodeURIComponent(returnUrl)}`;
  }
</script>

<svelte:head>
  <title>Cobra</title>
  <link rel="icon" href={favicon} />
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css"
    integrity="sha384-xOolHFLEh07PJGoPkLv1IbcEPTNtaed2xpHsD9ESMhqIYd0nLMwNLD69Npy4HI+N"
    crossorigin="anonymous"
  />
  <link rel="stylesheet" href="../../node_modules/@fortawesome/fontawesome-free/css/all.min.css" />
</svelte:head>

<nav class="navbar navbar-expand-lg fixed-top navbar-dark dontprint">
  <div class="container">
    <a href={resolve("/")} class="navbar-brand">Cobra (SPA)</a>
    <ul class="navbar-nav ml-auto">
      <li class="nav-item">
        <a href={resolve("/")} class="nav-link text-light">
          <FontAwesomeIcon icon="life-ring" />
          How to
        </a>
      </li>
      <li class="nav-item dropdown">
        <button
          type="button"
          id="tournamentTypeDropdown"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
          class="nav-link dropdown-toggle text-light btn btn-link"
        >
          <FontAwesomeIcon icon="trophy" />
          Tournament types
        </button>
      </li>

      {#if authStore.isAuthenticated && authStore.user}
        <li class="nav-item dropdown {isDropdownOpen ? 'show' : ''}">
          <button
            type="button"
            id="signedInDropdown"
            class="btn btn-link nav-link dropdown-toggle text-light"
            onclick={toggleDropdown}
            aria-expanded={isDropdownOpen}
          >
            <FontAwesomeIcon icon="user" />
            {authStore.user.nrdb_username}
          </button>
          <div
            class="dropdown-menu dropdown-menu-right {isDropdownOpen ? 'show' : ''}"
            aria-labelledby="signedInDropdown"
          >
            <a href={resolve("/tournaments/my")} class="dropdown-item" onclick={closeDropdown}>
              <FontAwesomeIcon icon="trophy" />
              My tournaments
            </a>
            <div class="dropdown-divider"></div>
            <a href={getLogoutUrl()} rel="external" class="dropdown-item" onclick={closeDropdown}>
              <FontAwesomeIcon icon="sign-out" />
              Jack Out
            </a>
          </div>
        </li>
      {:else}
        <li class="nav-item">
          <a href={resolve("/login")} id="signIn" class="nav-link text-light">
            <FontAwesomeIcon icon="sign-in" />
            Sign in
          </a>
        </li>
      {/if}
    </ul>
  </div>
</nav>

<div class="container">
  {@render children()}
</div>

<div class="footer dontprint">
  <div class="container">
    <div class="row">
      <div class="col-3 nav-item">
        <a href="https://ko-fi.com/nullsignalgames">Support NSG on Ko-fi</a>
      </div>
      <div class="col-6 nav-item text-center">
        🐍 Maintained by <a href="https://nullsignal.games">Null Signal Games</a>. Created by Johno.
        🐍
      </div>
      <div class="col-3 nav-item">
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSdP_q1BqJbct1agLHBK-TdW08vEMeb8IRS1m9XofQMS6EUZnA/viewform"
          target="_blank"
          rel="noopener nofollow"
          class="text-muted ml-3">Report an issue</a
        >
      </div>
    </div>
  </div>
</div>
