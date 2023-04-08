import client from "../client";
import bycrpt from "bcrypt";

export default {
  Mutation: {
    createAccount: async (
      _,
      { firstName, lastName, username, email, password }
    ) => {
      try {
        const existsUser = await client.user.findFirst({
          where: {
            OR: [
              {
                username,
              },
              {
                email,
              },
            ],
          },
        });
        if (existsUser) {
          throw new Error("This username or password is already taken.");
        }
        const hashed = await bycrpt.hash(password, 10);
        const user = await client.user.create({
          data: {
            username,
            email,
            firstName,
            lastName,
            password: hashed,
          },
        });
        return user;
      } catch (e) {
        return e;
      }
    },
  },
};
