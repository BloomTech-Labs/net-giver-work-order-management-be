import { GraphQLDate, GraphQLDateTime } from "graphql-iso-date";

import userResolvers from "./user";
import workorderResolvers from "./workorder";
import photosResolvers from "./photos";
import workorderphoto from "./workorderphoto";
// import commentResolvers from "./comments";

const customScalarResolver = {
  Date: GraphQLDate,
  DateTime: GraphQLDateTime
};

const errresolver = {
  Query: {
    readError: (parent, args, context) => {
      fs.readFileSync("/does/not/exist");
    }
  }
};

export default [
  // errresolver,
  customScalarResolver,
  userResolvers,
  workorderResolvers,
  photosResolvers,
  workorderphoto
];
