import { gql } from "apollo-server";
import userSchema from "./user";
import workorderSchema from "./workorder";
import photosSchema from "./photos";
import workorderphoto from "./workorderphoto";
import comments from "./comments";

const linkSchema = gql`
  scalar Date

  scalar DateTime

  scalar Dateserial

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
  workorderphoto,
  comments
];
