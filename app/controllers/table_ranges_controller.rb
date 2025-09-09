# frozen_string_literal: true

class TableRangesController < ApplicationController
  before_action :set_tournament
  before_action :set_stage
  before_action :set_table_range, only: %i[update destroy]

  def create
    authorize @tournament, :update?

    redirect_to tournament_stage_path(@tournament, @stage)

    new_range = params.require(:table_range).permit(:first_table, :last_table)
    @stage.table_ranges.create(new_range)
  end

  def update
    authorize @tournament, :update?

    redirect_to tournament_stage_path(@tournament, @stage)

    new_range = params.require(:table_range).permit(:first_table, :last_table)
    @table_range.update(new_range)
  end

  def destroy
    authorize @tournament, :update?

    redirect_to tournament_stage_path(@tournament, @stage)

    @table_range.destroy
  end

  def set_stage
    @stage = Stage.find(params[:stage_id])
  end

  def set_table_range
    @table_range = TableRange.find(params[:id])
  end
end
