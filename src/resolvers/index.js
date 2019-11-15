import { GraphQLDate, GraphQLDateTime } from "graphql-iso-date";

import userResolvers from "./user";
import workorderResolvers from "./workorder";
import photosResolvers from "./photos";
import workorderphoto from "./workorderphoto";
import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";
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

const formatDate = createdAt => {
  const date = new Date(createdAt);
  let formattedDate =
    date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
  return formattedDate;
};

const resolverMap = {
  Dateserial: new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value.getTime(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(ast.value); // ast value is always in string format
      }
      return null;
    }
  })
};

export default [
  // errresolver,
  resolverMap,
  customScalarResolver,
  userResolvers,
  workorderResolvers,
  photosResolvers,
  workorderphoto
];
