import client from "../../client";
import { protectResolver } from "../users.utils";

export default {
  Mutation: {
    unfollowUser: protectResolver(async (_, { username }, { loggedUser }) => {
      const ok = await client.user.findUnique({
        where: {
          username,
        },
      });
      if (!ok) {
        return {
          ok: false,
          error: "Can't unfollow.",
        };
      }
      await client.user.update({
        where: {
          id: loggedUser.id,
        },
        data: {
          following: {
            disconnect: {
              username,
            },
          },
        },
      });
      return {
        ok: true,
      };
    }),
  },
};
