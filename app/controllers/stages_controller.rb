# frozen_string_literal: true

class StagesController < ApplicationController
  before_action :set_tournament
  before_action :set_stage, only: %i[show update destroy settings]

  def show
    authorize @tournament, :update?
  end

  def create
    authorize @tournament, :update?

    stage = @tournament.stages.create(format: (@tournament.single_sided? ? :single_sided_swiss : :swiss))
    @tournament.players.each { |p| stage.players << p }

    redirect_to tournament_rounds_path(@tournament)
  end

  def update
    authorize @tournament, :update?

    params = stage_params

    # Save table ranges
    @stage.table_ranges.destroy_all
    @stage.table_ranges.create(params[:table_ranges])

    respond_to do |format|
      format.html do
        redirect_back_or_to tournament_stage_path(@tournament, @stage)
        return
      end
      format.json do
        head :no_content
      end
    end
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

  def stage_params
    params.require(:stage).permit(:id, :tournament_id, :number, :format,
                                  table_ranges: %i[id stage_id first_table last_table])
  end

  def stage_json(stage)
    {
      stage: {
        id: stage.id,
        tournament_id: stage.tournament_id,
        number: stage.number,
        format: stage.format.titleize,
        table_ranges: table_range_json(stage)
      },
      csrf_token: form_authenticity_token
    }
  end

  def table_range_json(stage)
    table_ranges = []

    stage.table_ranges.each do |tr|
      table_ranges << {
        id: tr.id,
        stage_id: tr.stage_id,
        first_table: tr.first_table,
        last_table: tr.last_table
      }
    end

    table_ranges
  end
end
