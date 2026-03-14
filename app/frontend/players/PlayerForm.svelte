<script lang="ts">
  import type { Tournament, TournamentPolicies } from "../pairings/PairingsData";
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
  });
</script>

<div class="identities_form d-block">
  <!-- Player name -->
  <div class="form-group">
    <!-- TODO: Locked icon -->
    
    <label class="d-block" for="player_name_{playerEdit.id}">Name</label>
    <input id="player_name_{playerEdit.id}" type="text" class="form-control" placeholder="Enter player name" bind:value={playerEdit.name} />
  </div>

  <!-- Pronouns -->
  <div class="form-group">
    <label class="d-block" for="player_name_{playerEdit.id}">Pronouns</label>
    <input id="player_name_{playerEdit.id}" type="text" class="form-control" placeholder="Example: they/them" bind:value={playerEdit.pronouns} />
  </div>

  <!-- Corp ID -->
  <div class="form-group">
    <label class="d-block" for="player_name_{playerEdit.id}">Corp ID</label>
    <input id="player_name_{playerEdit.id}" type="text" class="form-control corp_identities" placeholder="Example: they/them" readonly={tournament.nrdb_deck_registration} bind:value={playerEdit.corp_name} />
  </div>

  <!-- Runner ID -->
  <div class="form-group">
    <label class="d-block" for="player_name_{playerEdit.id}">Runner ID</label>
    <input id="player_name_{playerEdit.id}" type="text" class="form-control runner_identities" placeholder="Example: they/them" readonly={tournament.nrdb_deck_registration} bind:value={playerEdit.runner_name} />
  </div>

  <!-- Streaming opt-out -->
  {#if tournament.allow_streaming_opt_out}
    <div class="input boolean optional">
      <label class="checkbox">
        <input id="player_include_in_stream_{playerEdit.id}" type="checkbox" class="boolean optional" bind:checked={playerEdit.include_in_stream} />
        Opted out of video coverage
      </label>
    </div>
  {/if}

  {#if tournamentPolicies.update}
    <!-- First round bye -->
    <div class="input boolean optional">
      <label class="checkbox">
        <input id="player_first_round_bye_{playerEdit.id}" type="checkbox" class="boolean optional" bind:checked={playerEdit.first_round_bye} />
        First Round Bye
      </label>
    </div>

    <!-- TODO: Manual seed -->
  {/if}
</div>
