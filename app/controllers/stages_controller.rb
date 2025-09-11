# frozen_string_literal: true

class StagesController < ApplicationController
  before_action :set_tournament
  before_action :set_stage, only: %i[show update destroy settings]

  def show
    authorize @tournament, :update?

    # render json: stage_json(@stage), status: :ok
  end

  def create
    authorize @tournament, :update?

    stage = @tournament.stages.create(format: (@tournament.single_sided? ? :single_sided_swiss : :swiss))
    @tournament.players.each { |p| stage.players << p }

    redirect_to tournament_rounds_path(@tournament)
  end

  def update
    authorize @tournament, :update?

    redirect_to tournament_rounds_path(@tournament)

    # Save table ranges
    begin
      range_data = params.key?(:table_ranges) ? JSON.parse(params[:table_ranges]) : []
    rescue StandardError
      return
    end
    @stage.table_ranges.destroy_all
    @stage.table_ranges.create(range_data)
  end

  def destroy
    authorize @tournament, :update?

    @stage.destroy!

    redirect_to tournament_rounds_path(@tournament)
  end

  def settings
    authorize @tournament, :update?

    render json: stage_json(@stage), status: :ok
  end

  def set_stage
    @stage = Stage.find(params[:id])
  end

  private

  def stage_json(stage)
    {
      stage: {
        id: stage.id,
        format: stage.format.titleize,
        table_ranges: table_range_json(stage)
      },
      csrfToken: form_authenticity_token
    }
  end

  def table_range_json(stage)
    table_ranges = []

    stage.table_ranges.each do |tr|
      table_ranges << {
        id: tr.id,
        first_table: tr.first_table,
        last_table: tr.last_table
      }
    end

    table_ranges
  end
end
