import "dotenv/config";

import { ApolloServer } from "apollo-server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import schema from "./schema";
import { getUser } from "./users/users.utils";

const PORT = process.env.PORT;

const server = new ApolloServer({
  schema,
  context: async ({ req }) => {
    return {
      loggedUser: await getUser(req.headers.token),
    };
  },
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
});

server
  .listen(PORT)
  .then(() => console.log(`Server is running on http://localhost:${PORT}/`));
