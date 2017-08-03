module Serializers
  module User
    class UsersSerializer < Serializers::SupportSerializer
      attrs :id, :email, :name, :avatar
      attrs :stories

      delegate :id, to: :object

      def stories
        Serializers::Story::StorySerializer
        .new(object: object.stories).serializer
      end
    end
  end
end
