<script lang="ts">
  import type { Pairing, Player, PlayerSource, PredecessorMap } from "./PairingsData";
  import type { Identity } from "../identities/Identity";
  import IdentityComponent from "../identities/Identity.svelte";
  import { showIdentities } from "./ShowIdentities";

  export let match: Pairing;
  export let allMatches: Pairing[];
  export let predecessorMap: PredecessorMap;
  export let x: number;
  export let y: number;
  export let width: number;
  export let height: number;

  function parseWinnerSide(
    scoreLabel: string | null | undefined,
  ): "corp" | "runner" | null {
    if (!scoreLabel) return null;
    const res = /\((C|R)\)/.exec(scoreLabel);
    if (!res) return null;
    return res[1] === "C" ? "corp" : "runner";
  }

  function hasWinner(match: Pairing): boolean {
    return (
      !!match.score_label?.includes("R") || !!match.score_label?.includes("C")
    );
  }

  function isWinner(player: Player | undefined | null): boolean {
    if (!player) return false;
    if (!hasWinner(match)) return false;
    const winnerSide = parseWinnerSide(match.score_label);
    return winnerSide === player.side;
  }

  function isLoser(player: Player | undefined | null): boolean {
    if (!player) return false;
    if (!hasWinner(match)) return false;
    const winnerSide = parseWinnerSide(match.score_label);
    return winnerSide !== player.side;
  }

  function labelFor(match: Pairing): string {
    return match.table_number != null
      ? String(match.table_number)
      : (match.table_label ?? "");
  }

  function getIdentity(player: Player): Identity | undefined | null {
    if (player.side === "corp") {
      return player.corp_id;
    } else if (player.side === "runner") {
      return player.runner_id;
    }
    return null;
  }

  $: topPlayer = match.player1?.side === "corp" ? match.player1 : match.player2;
  $: bottomPlayer =
    match.player1?.side === "corp" ? match.player2 : match.player1;

  function getWinner(match: Pairing): Player | null {
    if (!hasWinner(match)) return null;
    const winnerSide = parseWinnerSide(match.score_label);
    return [match.player1, match.player2].find(p => p?.side === winnerSide) ?? null;
  }

  function getLoser(match: Pairing): Player | null {
    if (!hasWinner(match)) return null;
    const winnerSide = parseWinnerSide(match.score_label);
    return [match.player1, match.player2].find(p => p && p.side !== winnerSide) ?? null;
  }

  function getPlayerFromSource(source: PlayerSource | null): string | null {
    if (!source) return null;
    
    const sourceMatch = allMatches.find(m => m.table_number === source.game);
    if (!sourceMatch) return null;
    
    const player = source.method === 'winner' ? getWinner(sourceMatch) : getLoser(sourceMatch);
    return player?.name_with_pronouns ?? null;
  }

  function getFallbackText(source: PlayerSource | null): string | null {
    if (!source) return null;
    
    const role = source.method === 'winner' ? 'Winner' : 'Loser';
    return `${role} of ${source.game}`;
  }


  const sources = predecessorMap[match.table_number];
  $: topPlayerName = getPlayerFromSource(sources?.[0]);
  $: topFallback = getFallbackText(sources?.[0]);
  $: bottomPlayerName = getPlayerFromSource(sources?.[1]);
  $: bottomFallback = getFallbackText(sources?.[1]);
</script>

<!-- eslint-disable-next-line @typescript-eslint/restrict-template-expressions -->
<g transform={`translate(${x}, ${y})`}>
  <rect {width} {height} rx="6" ry="6" fill="#fff" stroke="#ccc" />
  <text x="8" y={height / 2} class="game-label" dominant-baseline="middle"
    >{labelFor(match)}</text
  >
  <foreignObject x="28" y="2" width={width - 40} height={height - 4}>
    <div xmlns="http://www.w3.org/1999/xhtml" class="small content">
      <div class="player-line d-flex" class:mb-1={$showIdentities}>
        <div
          class="flex-fill pr-2 {match.score_label
            ? !hasWinner(match)
              ? ''
              : isWinner(topPlayer)
                ? 'winner'
                : 'loser'
            : ''}"
        >
          {#if topPlayer}
            {@const identity = getIdentity(topPlayer)}
            <div class="player-info">
              {#if identity}
                <IdentityComponent
                  {identity}
                  include_name={false}
                  gray_out={isLoser(topPlayer)}
                />
              {/if}
              <span class="truncate">
                {topPlayer.name_with_pronouns}
              </span>
            </div>
            {#if $showIdentities}
              {#if identity}
                <div class="ids">
                  <IdentityComponent
                    {identity}
                    include_icon={false}
                    gray_out={isLoser(topPlayer)}
                  />
                </div>
              {/if}
            {/if}
          {:else if topPlayerName ?? topFallback}
            <span class="truncate" class:placeholder-text={topPlayerName == null}>
              {topPlayerName ?? topFallback}
            </span>
          {:else}
            <em class="text-muted">TBD</em>
          {/if}
        </div>
      </div>
      <div class="player-line d-flex">
        <div
          class="flex-fill pr-2 {match.score_label
            ? !hasWinner(match)
              ? ''
              : isWinner(bottomPlayer)
                ? 'winner'
                : 'loser'
            : ''}"
        >
          {#if bottomPlayer}
            {@const identity = getIdentity(bottomPlayer)}
            <div class="player-info">
              {#if identity}
                <IdentityComponent
                  {identity}
                  include_name={false}
                  gray_out={isLoser(bottomPlayer)}
                />
              {/if}
              <span class="truncate">
                {bottomPlayer.name_with_pronouns}
              </span>
            </div>
            {#if $showIdentities}
              {#if identity}
                <div class="ids">
                  <IdentityComponent
                    {identity}
                    include_icon={false}
                    gray_out={isLoser(bottomPlayer)}
                  />
                </div>
              {/if}
            {/if}
          {:else if bottomPlayerName ?? bottomFallback}
            <span class="truncate" class:placeholder-text={bottomPlayerName == null}>
              {bottomPlayerName ?? bottomFallback}
            </span>
          {:else}
            <em class="text-muted">TBD</em>
          {/if}
        </div>
      </div>
    </div>
  </foreignObject>
</g>

<style>
  .small {
    font-size: 0.85rem;
    line-height: 1.1rem;
  }
  .content {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .winner {
    font-weight: 600;
    color: #212529;
  }
  .loser {
    color: #6c757d;
  }
  .player-line {
    white-space: nowrap;
    overflow: visible;
  }
  .player-info {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .truncate {
    display: inline-block;
    max-width: 100%;
    vertical-align: bottom;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .game-label {
    font-size: 0.75rem;
    fill: #6c757d;
    font-weight: 500;
  }
  .ids {
    font-size: 0.7rem;
    white-space: nowrap;
    overflow-x: hidden;
    overflow-y: visible;
    line-height: 1.2;
    margin-top: 2px;
  }
  .placeholder-text {
    color: #868e96;
    font-style: italic;
  }
</style>
