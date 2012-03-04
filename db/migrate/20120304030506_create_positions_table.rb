class CreatePositionsTable < ActiveRecord::Migration
  def up
    create_table :positions do |t|
      t.string :user_id
      t.decimal :lat, :precision => 18, :scale => 15
      t.decimal :lng, :precision => 18, :scale => 15
    end
    add_index :positions, :user_id
  end

  def down
  end
end
