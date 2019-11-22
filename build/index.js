"use strict";

require("dotenv/config");

var _cors = _interopRequireDefault(require("cors"));

var _morgan = _interopRequireDefault(require("morgan"));

var _http = _interopRequireDefault(require("http"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _dataloader = _interopRequireDefault(require("dataloader"));

var _express = _interopRequireDefault(require("express"));

var _apolloServerExpress = require("apollo-server-express");

var _schema = _interopRequireDefault(require("./schema"));

var _resolvers = _interopRequireDefault(require("./resolvers"));

var _models = _interopRequireWildcard(require("./models"));

var _loaders = _interopRequireDefault(require("./loaders"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express.default)();
app.use((0, _cors.default)()); // app.use(morgan("dev"));
// if (app.get("env") == "production") {
//   app.use(
//     morgan("common", {
//       skip: function(req, res) {
//         return res.statusCode < 400;
//       },
//       stream: __dirname + "morgan.log"
//     })
//   );
// } else {
//   app.use(morgan("dev"));
// }

const getMe = async req => {
  const token = req.headers["x-token"];

  if (token) {
    try {
      return await _jsonwebtoken.default.verify(token, process.env.SECRET);
    } catch (e) {
      throw new _apolloServerExpress.AuthenticationError("Your session expired. Sign in again.");
    }
  }
};

const server = new _apolloServerExpress.ApolloServer({
  introspection: true,
  playground: true,
  typeDefs: _schema.default,
  resolvers: _resolvers.default,
  formatError: error => {
    const message = error.message; // .replace("SequelizeValidationError: ", "")
    // .replace("Validation error: ", "");

    return { ...error,
      message
    };
  },
  context: async ({
    req,
    connection
  }) => {
    if (connection) {
      return {
        models: _models.default,
        loaders: {
          user: new _dataloader.default(keys => _loaders.default.user.batchUsers(keys, _models.default))
        }
      };
    }

    if (req) {
      const me = await getMe(req);
      return {
        models: _models.default,
        me,
        secret: process.env.SECRET,
        loaders: {
          user: new _dataloader.default(keys => _loaders.default.user.batchUsers(keys, _models.default))
        }
      };
    }
  }
});
server.applyMiddleware({
  app,
  path: "/graphql"
});

const httpServer = _http.default.createServer(app);

server.installSubscriptionHandlers(httpServer);
const isTest = !!process.env.TEST_DATABASE;
const isDev = !!process.env.DATABASE;
const isProduction = !!process.env.DATABASE_URL;
const port = process.env.PORT || 3000; /// seeding
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

_models.sequelize.sync({
  force: false
}).then(async () => {
  httpServer.listen({
    port
  }, () => {
    console.log(`Apollo Server on http://localhost:${port}/graphql`);
  });
});

const createUsersWithWorkorders = async date => {
  await _models.default.User.create({
    username: "bryant",
    email: "bryantpatton@gmail.com",
    password: "bryant",
    role: "ADMIN",
    phone: "4153163549",
    authyId: "82620055",
    workorders: [{
      title: "paint the dining area",
      createdAt: date.setSeconds(date.getSeconds() + 1),
      qrcode: "000002"
    }]
  }, {
    include: [_models.default.Workorder]
  });
  await _models.default.User.create({
    username: "skylerd",
    email: "skyler2440@gmail.com",
    password: "password",
    role: "ADMIN",
    phone: "3523904132",
    authyId: "190296236",
    workorders: [{
      title: "fix broken sink in unit 101",
      createdAt: date.setSeconds(date.getSeconds() + 1),
      qrcode: "000001"
    }]
  }, {
    include: [_models.default.Workorder]
  });
};