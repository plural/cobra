WITH
players_with_identities AS (
    SELECT p.tournament_id AS tournament_id,
        p.id AS player_id,
        p.user_id,
        p.name,
        p.pronouns,
        p.corp_identity,
        ci.faction as corp_faction,
        p.runner_identity,
        ri.faction AS runner_faction
    FROM
        players p
        LEFT JOIN identities AS ci ON p.corp_identity_ref_id = ci.id
        LEFT JOIN identities AS ri ON p.runner_identity_ref_id = ri.id
),
tournaments_and_stages AS (
    SELECT
        t.id AS tournament_id,
        s.id AS stage_id,
        s.number AS stage_number,
        s.format AS stage_format
    FROM
        tournaments AS t
        INNER JOIN stages AS s ON t.id = s.tournament_id
),
rounds_and_pairings AS (
    SELECT
        r.stage_id AS stage_id,
        p.round_id AS round_id,
        r.number AS round_number,
        r.completed AS round_completed,
        p.id AS pairing_id,
        p.table_number AS table_number,
        p.player1_id AS player1_id,
        p.player2_id AS player2_id,
        p.score1,
        p.score2,
        p.side,
        p.score1_corp,
        p.score1_runner,
        p.score2_corp,
        p.score2_runner,
        p.intentional_draw,
        p.two_for_one,
        pwi_1.user_id AS player1_user_id,
        pwi_1.name AS player1_name,
        pwi_1.pronouns AS player1_pronouns,
        pwi_1.corp_identity AS player1_corp_identity,
        pwi_1.corp_faction AS player1_corp_faction,
        pwi_1.runner_identity AS player1_runner_identity,
        pwi_1.runner_faction AS player1_runner_faction,
        pwi_2.user_id AS player2_user_id,
        pwi_2.name AS player2_name,
        pwi_2.pronouns AS player2_pronouns,
        pwi_2.corp_identity AS player2_corp_identity,
        pwi_2.corp_faction AS player2_corp_faction,
        pwi_2.runner_identity AS player2_runner_identity,
        pwi_2.runner_faction AS player2_runner_faction
    FROM
        rounds AS r
        INNER JOIN pairings AS p ON p.round_id = r.id
        INNER JOIN stages AS s ON r.stage_id = s.id
        INNER JOIN players_with_identities AS pwi_1 ON p.player1_id = pwi_1.player_id
        INNER JOIN players_with_identities AS pwi_2 ON p.player2_id = pwi_2.player_id
)
SELECT
    tas.tournament_id,
    tas.stage_id,
    tas.stage_number,
    tas.stage_format,
    rap.round_id,
    rap.round_number,
    rap.round_completed,
    rap.pairing_id,
    rap.table_number,
    rap.player1_id,
    rap.player2_id,
    rap.score1,
    rap.score2,
    rap.side,
    rap.score1_corp,
    rap.score1_runner,
    rap.score2_corp,
    rap.score2_runner,
    rap.intentional_draw,
    rap.two_for_one,
    rap.player1_user_id,
    rap.player1_name,
    rap.player1_pronouns,
    rap.player1_corp_identity,
    rap.player1_corp_faction,
    rap.player1_runner_identity,
    rap.player1_runner_faction,
    rap.player2_user_id,
    rap.player2_name,
    rap.player2_pronouns,
    rap.player2_corp_identity,
    rap.player2_corp_faction,
    rap.player2_runner_identity,
    rap.player2_runner_faction
FROM
    tournaments_and_stages AS tas
    LEFT JOIN rounds_and_pairings AS rap ON rap.stage_id = tas.stage_id
;