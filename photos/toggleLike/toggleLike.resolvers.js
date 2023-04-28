import client from "../../client";
import { protectResolver } from "../../users/users.utils";

export default {
  Mutation: {
    toggleLike: protectResolver(async (_, { id }, { loggedUser }) => {
      const photo = await client.photo.findUnique({
        where: {
          id,
        },
      });
      if (!photo) {
        return {
          ok: false,
          error: "Photo not found",
        };
      }
      const likewhere = {
        photoId_userId: {
          userId: loggedUser.id,
          photoId: photo.id,
        },
      };
      const like = await client.like.findUnique({
        where: likewhere,
      });
      if (like) {
        await client.like.delete({
          where: likewhere,
        });
      } else {
        await client.like.create({
          data: {
            user: {
              connect: {
                id: loggedUser.id,
              },
            },
            photo: {
              connect: {
                id: photo.id,
              },
            },
          },
        });
      }
      return {
        ok: true,
      };
    }),
  },
};
