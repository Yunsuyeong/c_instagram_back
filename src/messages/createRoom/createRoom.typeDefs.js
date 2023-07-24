import { gql } from "apollo-server";

export default gql`
  type Mutation {
    createRoom(username: String!): MutationResponse!
  }
`;
