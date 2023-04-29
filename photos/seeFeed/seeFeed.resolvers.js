import client from "../../client";
import { protectResolver } from "../../users/users.utils";

export default {
  Query: {
    seeFeed: protectResolver((_, __, { loggedUser }) =>
      client.photo.findMany({
        where: {
          OR: [
            {
              user: {
                followers: {
                  some: {
                    id: loggedUser.id,
                  },
                },
              },
            },
            {
              userId: loggedUser.id,
            },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    ),
  },
};
