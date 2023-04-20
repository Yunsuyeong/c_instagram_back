import client from "../../client";
import bycrpt from "bcrypt";
import { protectResolver } from "../users.utils";
import { createWriteStream } from "fs";

const resolverfn = async (
  _,
  { firstName, lastName, username, email, password, bio, avatar },
  { loggedUser }
) => {
  let avatarUrl = null;
  if (avatar) {
    const { filename, createReadStream } = await avatar;
    const newFilename = `${loggedUser.id}-${Date.now()}-${filename}`;
    const readStream = createReadStream();
    const writeStream = createWriteStream(
      `${process.cwd()}/uploads/${newFilename}`
    );
    readStream.pipe(writeStream);
    avatarUrl = `http://localhost:4000/static/${newFilename}`;
  }
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
      ...(avatarUrl && { avatar: avatarUrl }),
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
