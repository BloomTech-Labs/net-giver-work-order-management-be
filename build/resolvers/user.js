"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _graphqlResolvers = require("graphql-resolvers");

var _apolloServer = require("apollo-server");

var _authorization = require("./authorization");

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
      password
    }, {
      models,
      secret
    }) => {
      const user = await models.User.create({
        username,
        email,
        password
      });
      return {
        token: createToken(user, secret, "30m")
      };
    },
    signIn: async (parent, {
      login,
      password
    }, {
      models,
      secret
    }) => {
      const user = await models.User.findByLogin(login);

      if (!user) {
        throw new _apolloServer.UserInputError("No user found with this login credentials.");
      }

      const isValid = await user.validatePassword(password);

      if (!isValid) {
        throw new _apolloServer.AuthenticationError("Invalid password.");
      }

      return {
        token: createToken(user, secret, "30m")
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
    })
  },
  User: {
    messages: async (user, args, {
      models
    }) => {
      return await models.Message.findAll({
        where: {
          userId: user.id
        }
      });
    }
  }
};
exports.default = _default;