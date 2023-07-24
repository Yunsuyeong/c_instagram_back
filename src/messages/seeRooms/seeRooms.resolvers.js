import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
  Query: {
    seeRooms: protectedResolver(async (_, __, { loggedUser }) =>
      client.room.findMany({
        where: {
          users: {
            some: {
              id: loggedUser.id,
            },
          },
        },
      })
    ),
  },
};
