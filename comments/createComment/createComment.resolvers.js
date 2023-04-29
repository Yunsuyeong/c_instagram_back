import client from "../../client";
import { protectResolver } from "../../users/users.utils";

export default {
  Mutation: {
    createComment: protectResolver(
      async (_, { photoId, payload }, { loggedUser }) => {
        const ok = await client.photo.findUnique({
          where: {
            id: photoId,
          },
          select: {
            id: true,
          },
        });
        if (!ok) {
          return {
            ok: false,
            error: "Photo not found",
          };
        }
        await client.comment.create({
          data: {
            payload,
            photo: {
              connect: {
                id: photoId,
              },
            },
            user: {
              connect: {
                id: loggedUser.id,
              },
            },
          },
        });
        return {
          ok: true,
        };
      }
    ),
  },
};
