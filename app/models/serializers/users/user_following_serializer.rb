module Serializers
  module Users
    class UserFollowingSerializer < Serializers::SupportSerializer
      attrs :id, :email, :name, :avatar
      attrs :stories, :following_user

      def stories
        Serializers::Stories::StorySerializer
          .new(object: object.stories.newest).serializer
      end

      def following_user
        Serializers::Users::UserFollowingSerializer
          .new(object: object.following).serializer
      end
    end
  end
end
