import { GraphQLDateTime } from "graphql-iso-date";

import userResolvers from "./user";
import workorderResolvers from "./workorder";
import photosResolvers from "./photos";
import workorderphoto from "./workorderphoto";
const customScalarResolver = {
  Date: GraphQLDateTime
};

export default [
  customScalarResolver,
  userResolvers,
  workorderResolvers,
  photosResolvers,
  workorderphoto
];
