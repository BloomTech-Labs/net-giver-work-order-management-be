import { GraphQLDateTime } from "graphql-iso-date";

import userResolvers from "./user";
import workorderResolvers from "./workorder";

const customScalarResolver = {
  Date: GraphQLDateTime
};

export default [customScalarResolver, userResolvers, workorderResolvers];
