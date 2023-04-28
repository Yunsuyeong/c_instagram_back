import client from "../../client";
import { protectResolver } from "../../users/users.utils";
import { processHashtags } from "../photos.utils";

export default {
  Mutation: {
    uploadPhoto: protectResolver(
      async (_, { file, caption }, { loggedUser }) => {
        let hashtagObjs = [];
        if (caption) {
          hashtagObjs = processHashtags(caption);
        }
        return client.photo.create({
          data: {
            file,
            caption,
            user: {
              connect: {
                id: loggedUser.id,
              },
            },
            ...(hashtagObjs.length > 0 && {
              hashtags: {
                connectOrCreate: hashtagObjs,
              },
            }),
          },
        });
        //save photo
        //add photo to hash
      }
    ),
  },
};
