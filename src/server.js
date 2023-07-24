import "dotenv/config";
import http from "http";
import express from "express";
import logger from "morgan";
import { ApolloServer } from "apollo-server-express";
import { getUser } from "./users/users.utils";
import { typeDefs, resolvers } from "./schema";
import pubsub from "./pubsub";

const PORT = process.env.PORT;

const apollo = new ApolloServer({
  resolvers,
  typeDefs,
  context: async (ctx) => {
    if (ctx.req) {
      return {
        loggedUser: await getUser(ctx.req.headers.token),
      };
    } else {
      const {
        connection: { context },
      } = ctx;
      return {
        loggedUser: context.loggedUser,
      };
    }
  },
  subscriptions: {
    onConnect: async ({ token }) => {
      if (!token) {
        throw new Error("You can't listen");
      }
      const loggedUser = await getUser(token);
      return {
        loggedUser,
      };
    },
  },
});

const app = express();
app.use(logger("tiny"));
app.use("/static", express.static("uploads"));
apollo.applyMiddleware({ app });

const httpServer = http.createServer(app);
apollo.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/graphql`);
});
