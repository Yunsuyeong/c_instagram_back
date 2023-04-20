import client from "../../client";
import { protectResolver } from "../users.utils";

export default {
  Mutation: {
    followUser: protectResolver(async (_, { username }, { loggedUser }) => {
      const ok = await client.user.findUnique({
        where: {
          username,
        },
      });
      if (!ok) {
        return {
          ok: false,
          error: "That user does not exist",
        };
      }
      await client.user.update({
        where: {
          id: loggedUser.id,
        },
        data: {
          following: {
            connect: {
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
