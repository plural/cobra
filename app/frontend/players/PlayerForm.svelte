<script lang="ts">
  import type { Tournament, TournamentPolicies } from "../pairings/PairingsData";
    import FontAwesomeIcon from "../widgets/FontAwesomeIcon.svelte";
  import type { Player } from "./PlayersData";

  let { player, tournament, tournamentPolicies }: { player: Player, tournament: Tournament, tournamentPolicies: TournamentPolicies } = $props();

  let playerEdit = $derived({
    id: player.id,
    name: player.name,
    pronouns: player.pronouns,
    corp_name: player.corp_id ? player.corp_id.name : "",
    runner_name: player.runner_id ? player.runner_id.name : "",
    include_in_stream: player.include_in_stream,
    first_round_bye: player.first_round_bye,
    manual_seed: player.manual_seed,
  });
</script>

<div class="identities_form form-row">
  <!-- Player name -->
  <div class="col">
    {#if tournament.self_registration}
      <span class="text-info float-left mr-2" style="width: 12px">
        <FontAwesomeIcon icon={player.registration_locked ? "lock" : "unlock"} />
      </span>
    {/if}
    
    <label for="player_name_{playerEdit.id}">Name</label>
    <input id="player_name_{playerEdit.id}" type="text" class="form-control" placeholder="Enter player name" bind:value={playerEdit.name} />
  </div>

  <!-- Pronouns -->
  <div class="col-auto">
    <label for="player_name_{playerEdit.id}">Pronouns</label>
    <input id="player_name_{playerEdit.id}" type="text" class="form-control" placeholder="Example: they/them" bind:value={playerEdit.pronouns} />
  </div>

  <!-- Corp ID -->
  <div class="col">
    <label for="player_name_{playerEdit.id}">Corp ID</label>
    <input id="player_name_{playerEdit.id}" type="text" class="form-control corp_identities" placeholder="Example: they/them" readonly={tournament.nrdb_deck_registration} bind:value={playerEdit.corp_name} />
  </div>

  <!-- Runner ID -->
  <div class="col">
    <label for="player_name_{playerEdit.id}">Runner ID</label>
    <input id="player_name_{playerEdit.id}" type="text" class="form-control runner_identities" placeholder="Example: they/them" readonly={tournament.nrdb_deck_registration} bind:value={playerEdit.runner_name} />
  </div>
</div>

<div class="form-row mt-2">
  <!-- Streaming opt-out -->
  {#if tournament.allow_streaming_opt_out}
    <div class="col-auto form-check form-check-inline">
      <input id="player_include_in_stream_{playerEdit.id}" type="checkbox" class="form-check-input" bind:checked={playerEdit.include_in_stream} />
      <label for="player_include_in_stream_{playerEdit.id}" class="form-check-label">Opted out of video coverage</label>
    </div>
  {/if}

  {#if tournamentPolicies.update}
    <!-- First round bye -->
    <div class="col-auto form-check form-check-inline">
      <input id="player_first_round_bye_{playerEdit.id}" type="checkbox" class="form-check-input" bind:checked={playerEdit.first_round_bye} />
      <label for="player_first_round_bye_{playerEdit.id}" class="form-check-label">First Round Bye</label>
    </div>

    <!-- Manual seed -->
    {#if tournament.manual_seed}
      <div class="col-auto form-inline">
        <label for="player_seed_{playerEdit.id}">Manual Seed</label>
        <input id="player_seed_{playerEdit.id}" type="number" class="form-control ml-1" style="width: 6em" placeholder="Set seed" bind:value={playerEdit.manual_seed} />
      </div>
    {/if}
  {/if}
</div>
