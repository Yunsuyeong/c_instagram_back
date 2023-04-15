import client from "../../client";
import bycrpt from "bcrypt";
import { protectResolver } from "../users.utils";

const resolverfn = async (
  _,
  { firstName, lastName, username, email, password, bio, avatar },
  { loggedUser }
) => {
  console.log(avatar);
  let hashed = null;
  if (password) {
    hashed = await bycrpt.hash(password, 10);
  }
  const editedUser = await client.user.update({
    where: {
      id: loggedUser.id,
    },
    data: {
      firstName,
      lastName,
      username,
      email,
      bio,
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
};

export default {
  Mutation: {
    editProfile: protectResolver(resolverfn),
  },
};
