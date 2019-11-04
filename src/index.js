import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import http from "http";
import jwt from "jsonwebtoken";
import DataLoader from "dataloader";
import { ApolloServer, AuthenticationError } from "apollo-server";
import schema from "./schema";
import resolvers from "./resolvers";
import models, { sequelize } from "./models";
import loaders from "./loaders";
import WorkOrderAPI from "./datasources/WorkOrderAPI";
const getUser = token => {
  try {
    if (token) {
      return jwt.verify(token, process.env.SECRET);
    }
    return null;
  } catch (err) {
    // throw new AuthenticationError("Your session expired. Sign in again.");
    return null;
  }
};

const server = new ApolloServer({
  introspection: true,
  playground: true,
  typeDefs: schema,
  resolvers,
  formatError: error => {
    const message = error.message.replace("SequelizeValidationError: ", "");
    if (message.startsWith("Database Error: ")) {
      return new Error("Internal server error");
    }
    // .replace("Validation error: ", "");
    return {
      ...error,
      message
    };
  },
  context: ({ req, res }) => {
    const token = req.headers["x-token"];
    //const token = tokenWithBearer.split(' ')[1]
    const user = getUser(token);
    return {
      models,
      user,
      secret: process.env.SECRET
    };
  }
});

// const server = new ApolloServer({
//   introspection: true,
//   playground: true,
//   typeDefs: schema,
//   dataSources: () => ({
//     workOrderAPI: new WorkOrderAPI()
//   }),
//   resolvers,
//   formatError: error => {
//     const message = error.message.replace("SequelizeValidationError: ", "");
//     if (message.startsWith("Database Error: ")) {
//       return new Error("Internal server error");
//     }
//     // .replace("Validation error: ", "");
//     return {
//       ...error,
//       message
//     };
//   },
//   context: ({ req, res }) => {
//     const token = req.headers["x-token"];
//     //const token = tokenWithBearer.split(' ')[1]
//     const user = getUser(token);
//     return {
//       user,
//       secret: process.env.SECRET
//     };
//   }
// });

const port = process.env.PORT || 4000;
// const port = 4000;
// sequelize.sync({ force: false }).then(async () => {
//   server.listen({ port }, () => {
//     console.log(`Apollo Server on http://localhost:${port}/graphql`);
//   });
// });
server.listen({ port }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
