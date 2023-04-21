import client from "../client";

export default {
  User: {
    totalFollowing: ({ id }) =>
      client.user.count({
        where: {
          followers: {
            some: {
              id,
            },
          },
        },
      }),
    totalFollowers: ({ id }) =>
      client.user.count({
        where: {
          following: {
            some: {
              id,
            },
          },
        },
      }),
    isMe: ({ id }, _, { loggedUser }) => {
      if (!loggedUser) {
        return false;
      }
      return id === loggedUser.id;
    },
    isFollowing: async ({ id }, _, { loggedUser }) => {
      if (!loggedUser) {
        return false;
      }
      const exists = await client.user.count({
        where: {
          username: loggedUser.username,
          following: {
            some: {
              id,
            },
          },
        },
      });
      return Boolean(exists);
    },
  },
};
