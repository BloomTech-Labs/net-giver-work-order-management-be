import { gql } from "apollo-server-express";

import userSchema from "./user";
import workorderSchema from "./workorder";
import photosSchema from "./photos";
import workorderphoto from "./workorderphoto";

const linkSchema = gql`
  scalar Date

  type Query {
    _: Boolean
    # readError: String
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;

export default [
  linkSchema,
  userSchema,
  workorderSchema,
  photosSchema,
  workorderphoto
];
