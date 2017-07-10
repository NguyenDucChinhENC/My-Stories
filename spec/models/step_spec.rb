require 'rails_helper'

RSpec.describe Step, type: :model do
  describe "ActiveModel validations" do
    it {should validate_presence_of :content}
  end

  describe "ActiveRecord validations" do
    it {should have_db_column(:content).of_type :text}
    it {should have_db_column(:completed_rate).of_type :integer}
    it {should have_db_column(:story_id).of_type :integer}

    it {should have_many :comments}
    it {should have_many(:votes).dependent :destroy}

    it {should belong_to :story}

    it {should have_db_index :story_id}
  end
end
