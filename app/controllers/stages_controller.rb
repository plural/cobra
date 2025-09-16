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

    error = validate_table_ranges(params[:table_ranges])

    # Save table ranges
    if error.nil?
      ActiveRecord::Base.transaction do
        begin
          @stage.table_ranges.destroy_all
          @stage.table_ranges.create!(params[:table_ranges])
        rescue => e
          error = "Unable to save stage: #{e}"
          raise ActiveRecord::Rollback
        end
      end
    end

    respond_to do |format|
      format.json do
        if error
          flash.now[:alert] = error
          render json: { error: error }, status: :unprocessable_entity
        else
          render json: { url: tournament_stage_path(@tournament, @stage) }, stats: :ok
        end
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
      warning: stage.validate_table_count,
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

  def validate_table_ranges(new_ranges_params)
    ranges = new_ranges_params.map { |params| TableRange.new(params) }

    ranges.each do |range_a|
      return 'The first table must be less than the last table.' if range_a.first_table > range_a.last_table

      ranges.each do |range_b|
        if range_a != range_b && \
           (range_b.in_range?(range_a.first_table) || range_b.in_range?(range_a.last_table))
          return 'Table ranges cannot overlap.'
        end
      end
    end

    nil
  end
end
