import { GraphQLDateTime } from "graphql-iso-date";

import userResolvers from "./user";
import workorderResolvers from "./workorder";
import photosResolvers from "./photos";

const customScalarResolver = {
  Date: GraphQLDateTime
};

export default [
  customScalarResolver,
  userResolvers,
  workorderResolvers,
  photosResolvers
];
