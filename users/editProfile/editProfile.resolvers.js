import client from "../../client";
import bycrpt from "bcrypt";

export default {
  Mutation: {
    editProfile: async (
      _,
      { firstName, lastName, username, email, password }
    ) => {
      let hashed = null;
      if (password) {
        hashed = await bycrpt.hash(password, 10);
      }
      const editedUser = await client.user.update({
        where: {
          id: 1,
        },
        data: {
          firstName,
          lastName,
          username,
          email,
          ...(hashed && { password: hashed }),
        },
      });
      if (editedUser.id) {
        return {
          ok: true,
        };
      } else {
        return {
          ok: false,
          error: "Could not edit profile",
        };
      }
    },
  },
};
