import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
  Query: {
    me: protectedResolver((_, __, { loggedUser }) =>
      client.user.findUnique({
        where: {
          id: loggedUser.id,
        },
      })
    ),
  },
};
