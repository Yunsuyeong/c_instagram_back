import jwt from "jsonwebtoken";
import client from "../client";

export const getUser = async (token) => {
  try {
    if (!token) {
      return null;
    }
    const { id } = await jwt.verify(token, process.env.SECRET_KEY);
    const user = await client.user.findUnique({
      where: {
        id,
      },
    });
    if (user) {
      return user;
    } else {
      return null;
    }
  } catch {
    return null;
  }
};

export function protectedResolver(ourResolver) {
  return function (root, args, context, info) {
    if (!context.loggedUser) {
      const query = info.operation.operation === "query";
      if (query) {
        return null;
      } else {
        return {
          ok: false,
          error: "please log in",
        };
      }
    }
    return ourResolver(root, args, context, info);
  };
}
