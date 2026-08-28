# frozen_string_literal: true

RSpec.describe 'Player registrations and multiple stages' do
  let(:tournament) { create(:tournament) }

  before do
    sign_in tournament.user
  end

  # This test is a little artificial because of the changes to always add players to
  # registrations for the swiss stage but does test our second layer of defense here.
  # We set up the bad state manually and bypass what the controllers would do intentionally.
  it 'restores missing player registrations to the swiss stage when a cut stage is deleted' do
    expect(tournament.stages.count).to eq(1)
    swiss_stage = tournament.stages.first
    expect(swiss_stage).to be_swiss

    create(:player, tournament:, name: 'Alice')
    expect(swiss_stage.reload.players.pluck(:name)).to contain_exactly('Alice')

    tournament.cut_to!(:double_elim, 4)
    cut_stage = tournament.stages.last

    create(:player, tournament:, name: 'Bob', skip_registration: true).tap do |player|
      cut_stage.players << player
    end
    create(:player, tournament:, name: 'Charlie', skip_registration: true).tap do |player|
      cut_stage.players << player
    end

    expect(swiss_stage.reload.players.pluck(:name)).to contain_exactly('Alice')
    expect(cut_stage.reload.players.pluck(:name)).to contain_exactly('Alice', 'Bob', 'Charlie')

    delete tournament_stage_path(tournament, cut_stage)

    expect(swiss_stage.reload.players.pluck(:name)).to contain_exactly('Alice', 'Bob', 'Charlie')
  end

  it 'adds newly registered players to the swiss stage even when a cut stage exists' do
    expect(tournament.stages.count).to eq(1)
    swiss_stage = tournament.stages.first
    expect(swiss_stage).to be_swiss

    tournament.cut_to!(:double_elim, 4)
    cut_stage = tournament.stages.last

    post tournament_players_path(tournament), params: { player: { name: 'Alice' } }
    post tournament_players_path(tournament), params: { player: { name: 'Bob' } }

    expect(swiss_stage.reload.players.pluck(:name)).to contain_exactly('Alice', 'Bob')
    expect(cut_stage.reload.players.pluck(:name)).to be_empty
  end
end
