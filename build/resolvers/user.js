"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _graphqlResolvers = require("graphql-resolvers");

var _apolloServer = require("apollo-server");

var _authorization = require("./authorization");

var _authyClient = require("authy-client");

var _authy = _interopRequireDefault(require("authy"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createToken = async (user, secret, expiresIn) => {
  const {
    id,
    email,
    username,
    role
  } = user;
  return await _jsonwebtoken.default.sign({
    id,
    email,
    username,
    role
  }, secret, {
    expiresIn
  });
};

let client;

if (process.env.ACCOUNT_SECURITY_API_KEY) {
  client = new _authyClient.Client({
    key: process.env.ACCOUNT_SECURITY_API_KEY
  });
} else {
  client = new _authyClient.Client({
    key: "foo"
  });
}

const registerAuthy = async ({
  email,
  phone
}) => {
  //const { user: { id: authyId } } = await client.registerUser({
  const register = await client.registerUser({
    countryCode: "US",
    email: email,
    phone: phone
  });
  const {
    user: {
      id: authyId
    }
  } = register; //const authyreq = await client.requestSms({ authyId });
  //const { cellphone } = authyreq;

  return authyId;
};

const sms = async authyId => {
  const smsRequest = await client.requestSms({
    authyId
  });
  const {
    cellphone
  } = smsRequest;
  return cellphone;
};

const verifyToken = async (authyId, cdde) => {
  const smsRequest = await client.verifyToken({
    authyId,
    code
  });
  const {
    cellphone
  } = smsRequest;
  return cellphone;
};

var _default = {
  Query: {
    users: async (parent, args, {
      models
    }) => {
      return await models.User.findAll();
    },
    user: async (parent, {
      id
    }, {
      models
    }) => {
      return await models.User.findByPk(id);
    },
    me: async (parent, args, {
      models,
      me
    }) => {
      if (!me) {
        return null;
      }

      return await models.User.findByPk(me.id);
    }
  },
  Mutation: {
    signUp: async (parent, {
      username,
      email,
      password,
      phone,
      picture,
      displayName
    }, {
      models,
      secret
    }) => {
      const authyId = await registerAuthy({
        email,
        phone
      });
      const user = await models.User.create({
        username,
        email,
        password,
        phone,
        picture,
        displayName,
        authyId
      });
      const token = createToken(user, secret, "30m");
      return {
        token: token,
        user: user,
        authyId: authyId
      };
    },
    signIn: async (parent, {
      username,
      password
    }, {
      models,
      secret
    }) => {
      const user = await models.User.findByLogin(username);

      if (!user) {
        throw new _apolloServer.UserInputError("No user found with this login credentials.");
      }

      if (password) {
        const isValid = await user.validatePassword(password);

        if (!isValid) {
          throw new _apolloServer.AuthenticationError("Invalid password.");
        }
      }

      const token = createToken(user, secret, "14d");
      const {
        authyId
      } = user;
      const smsRequest = await client.requestSms({
        authyId
      });
      const {
        cellphone
      } = smsRequest;
      return {
        token: token,
        user: user,
        authyId: authyId,
        phone: cellphone
      }; // return { token: createToken(user, secret, "30m") };
    },
    signInDev: async (parent, {
      username
    }, {
      models,
      secret
    }) => {
      const user = await models.User.findByLogin(username);

      if (!user) {
        throw new _apolloServer.UserInputError("No user found with this login credentials.");
      }

      const {
        authyId
      } = user;

      if (!authyId) {
        throw new _apolloServer.UserInputError("User has not registered with Authy.");
      }

      return {
        username: user.username
      };
    },
    authyVerifyDev: async (parent, {
      username,
      code
    }, {
      models,
      secret
    }) => {
      const user = await models.User.findByLogin(username);

      if (!user) {
        throw new _apolloServer.UserInputError("No user found with this login credentials.");
      }

      if (code !== "123456") {
        throw new _apolloServer.UserInputError("Wrong Auth Code. Try 123456");
      }

      const token = createToken(user, secret, "30m");
      return {
        token: token
      };
    },
    updateUser: (0, _graphqlResolvers.combineResolvers)(_authorization.isAuthenticated, async (parent, {
      username
    }, {
      models,
      me
    }) => {
      const user = await models.User.findByPk(me.id);
      return await user.update({
        username
      });
    }),
    deleteUser: (0, _graphqlResolvers.combineResolvers)(_authorization.isAdmin, async (parent, {
      id
    }, {
      models
    }) => {
      return await models.User.destroy({
        where: {
          id
        }
      });
    }),
    verifyAuthy: (0, _graphqlResolvers.combineResolvers)(_authorization.isAuthenticated, async (parent, {
      token
    }, {
      models,
      me
    }) => {
      const user = await models.User.findByPk(me.id);
      const {
        authyId
      } = user;
      const authyreq = client.verifyToken({
        authyId: authyId,
        token: token
      });
      const {
        cellphone
      } = authyreq;
      return cellphone;
    })
  },
  User: {
    workorders: async (user, args, {
      models
    }) => {
      return await models.Workorder.findAll({
        where: {
          userId: user.id
        }
      });
    }
  }
};
exports.default = _default;
module.exports = exports.default;