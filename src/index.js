import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import http from "http";
import jwt from "jsonwebtoken";
import DataLoader from "dataloader";
//import express from "express";
//import { ApolloServer, AuthenticationError } from "apollo-server-express";
import { ApolloServer, AuthenticationError } from "apollo-server";
import schema from "./schema";
import resolvers from "./resolvers";
import models, { sequelize } from "./models";
import loaders from "./loaders";

// const app = express();

// app.use(cors());

const getMe = async req => {
  const token = req.headers["x-token"];

  if (token) {
    try {
      var decoded = jwt.decode(token, { complete: true });
      return jwt.verify(token, process.env.SECRET);
    } catch (e) {
      throw new AuthenticationError("Your session expired. Sign in again.");
    }
  }
  // if (token) {
  //   return jwt.verify(token, process.env.SECRET, function(err, decoded) {
  //     console.log(decoded); // bar
  //   });
  // }
};

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
  // context: async ({ req, connection }) => {
  //   if (connection) {
  //     return {
  //       models,
  //       context,
  //       loaders: {
  //         user: new DataLoader(keys => loaders.user.batchUsers(keys, models))
  //       }
  //     };
  //   }

  //   if (req) {
  //     const me = await getMe(req);

  //     return {
  //       models,
  //       me,
  //       secret: process.env.SECRET,
  //       loaders: {
  //         user: new DataLoader(keys => loaders.user.batchUsers(keys, models))
  //       }
  //     };
  //   }
  // }
});

// server.applyMiddleware({ app, path: "/graphql" });

// const httpServer = http.createServer(app);
// server.installSubscriptionHandlers(httpServer);

const isTest = !!process.env.TEST_DATABASE;
const isDev = !!process.env.DATABASE;
const isProduction = !!process.env.DATABASE_URL;
const port = process.env.PORT || 3000;

/// seeding
// sequelize.sync({ force: isTest || isDev }).then(async () => {
//   if (isTest || isDev) {
//     createUsersWithWorkorders(new Date());
//   }

//   httpServer.listen({ port }, () => {
//     console.log(
//       `Apollo Server on http://localhost:${port}/graphql and isdev ${isDev}`
//     );
//   });
// });

sequelize.sync({ force: false }).then(async () => {
  server.listen({ port }, () => {
    console.log(`Apollo Server on http://localhost:${port}/graphql`);
  });
});

// const createUsersWithWorkorders = async date => {
//   await models.User.create(
//     {
//       username: "bryant",
//       email: "bryantpatton@gmail.com",
//       password: "bryant",
//       role: "ADMIN",
//       phone: "4153163549",
//       authyId: "82620055",
//       workorders: [
//         {
//           title: "paint the dining area",
//           createdAt: date.setSeconds(date.getSeconds() + 1),
//           qrcode: "000002"
//         }
//       ]
//     },
//     {
//       include: [models.Workorder]
//     }
//   );

//   await models.User.create(
//     {
//       username: "skylerd",
//       email: "skyler2440@gmail.com",
//       password: "password",
//       role: "ADMIN",
//       phone: "3523904132",
//       authyId: "190296236",
//       workorders: [
//         {
//           title: "fix broken sink in unit 101",
//           createdAt: date.setSeconds(date.getSeconds() + 1),
//           qrcode: "000001"
//         }
//       ]
//     },
//     {
//       include: [models.Workorder]
//     }
//   );
// };
