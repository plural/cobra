# frozen_string_literal: true

# NOTE: This test is a little funny because it does NOT verify the javascript protection.
# We are using capybara but no javascript driver at the moment.
# Since we are moving to Svelte, we will handle the full range of testing there.
RSpec.describe 'destroying tournaments', type: :feature do
  let(:tournament) { create(:tournament) }
  let(:round) { create(:round, tournament:, stage: tournament.current_stage) }

  before do
    create(:player, tournament:)
    create(:player, tournament:)

    round.pair!

    sign_in tournament.user
    visit danger_zone_tournament_path(tournament)
  end

  it 'destroys tournament' do
    expect(page).to have_button('Delete Tournament', disabled: true)
    expect(find_by_id('tournament_name').value).to be_empty
    expect(find_by_id('name_for_confirmation', visible: :all).value).to eq(tournament.name)

    expect do
      click_button 'Delete Tournament', disabled: true
    end.to change(Tournament, :count).by(-1)
  end

  it 'destroys associated players' do
    expect(page).to have_button('Delete Tournament', disabled: true)
    expect(find_by_id('tournament_name').value).to be_empty
    expect(find_by_id('name_for_confirmation', visible: :all).value).to eq(tournament.name)

    expect do
      click_button 'Delete Tournament', disabled: true
    end.to change(Player, :count).by(-2)
  end

  it 'destroys associated rounds' do
    expect(page).to have_button('Delete Tournament', disabled: true)
    expect(find_by_id('tournament_name').value).to be_empty
    expect(find_by_id('name_for_confirmation', visible: :all).value).to eq(tournament.name)

    expect do
      click_button 'Delete Tournament', disabled: true
    end.to change(Round, :count).by(-1)
  end

  it 'destroys associated pairings' do
    expect(page).to have_button('Delete Tournament', disabled: true)
    expect(find_by_id('tournament_name').value).to be_empty
    expect(find_by_id('name_for_confirmation', visible: :all).value).to eq(tournament.name)

    expect do
      click_button 'Delete Tournament', disabled: true
    end.to change(Pairing, :count).by(-1)
  end
end
