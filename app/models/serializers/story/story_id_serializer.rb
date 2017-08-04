module Serializers
  module Story
    class StoryIdSerializer < Serializers::SupportSerializer
      attrs :id, :category_id
      attrs :total_vote

      delegate :id, to: :object

      def total_vote
        Serializers::Vote::VotesSerializer
        .new(object: object.votes).serializer.count
      end
    end
  end
end
