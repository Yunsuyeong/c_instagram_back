import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
  Mutation: {
    createRoom: protectedResolver(async (_, { username }, { loggedUser }) => {
      let room = null;
      if (username) {
        const user = await client.user.findFirst({
          where: {
            username: user?.username,
          },
          select: {
            username: true,
          },
        });
        if (!user) {
          return {
            ok: false,
            error: "This user does not exist",
          };
        }
        room = await client.room.create({
          data: {
            users: {
              connect: [
                {
                  username,
                },
                {
                  username: loggedUser.username,
                },
              ],
            },
          },
        });
      }
      return {
        ok: true,
        id: room.id,
      };
    }),
  },
};
