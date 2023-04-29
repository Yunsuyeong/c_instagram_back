export default {
  Comment: {
    isMine: ({ userId }, _, { loggedUser }) => {
      if (!loggedUser) {
        return false;
      }
      return userId === loggedUser.id;
    },
  },
};
