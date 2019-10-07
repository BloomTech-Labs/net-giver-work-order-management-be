"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

var _graphqlResolvers = require("graphql-resolvers");

var _subscription = _interopRequireWildcard(require("../subscription"));

var _authorization = require("./authorization");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const toCursorHash = string => Buffer.from(string).toString('base64');

const fromCursorHash = string => Buffer.from(string, 'base64').toString('ascii');

var _default = {
  Query: {
    messages: async (parent, {
      cursor,
      limit = 100
    }, {
      models
    }) => {
      const cursorOptions = cursor ? {
        where: {
          createdAt: {
            [_sequelize.default.Op.lt]: fromCursorHash(cursor)
          }
        }
      } : {};
      const messages = await models.Message.findAll({
        order: [['createdAt', 'DESC']],
        limit: limit + 1,
        ...cursorOptions
      });
      const hasNextPage = messages.length > limit;
      const edges = hasNextPage ? messages.slice(0, -1) : messages;
      return {
        edges,
        pageInfo: {
          hasNextPage,
          endCursor: toCursorHash(edges[edges.length - 1].createdAt.toString())
        }
      };
    },
    message: async (parent, {
      id
    }, {
      models
    }) => {
      return await models.Message.findById(id);
    }
  },
  Mutation: {
    createMessage: (0, _graphqlResolvers.combineResolvers)(_authorization.isAuthenticated, async (parent, {
      text
    }, {
      models,
      me
    }) => {
      const message = await models.Message.create({
        text,
        userId: me.id
      });

      _subscription.default.publish(_subscription.EVENTS.MESSAGE.CREATED, {
        messageCreated: {
          message
        }
      });

      return message;
    }),
    deleteMessage: (0, _graphqlResolvers.combineResolvers)(_authorization.isAuthenticated, _authorization.isMessageOwner, async (parent, {
      id
    }, {
      models
    }) => {
      return await models.Message.destroy({
        where: {
          id
        }
      });
    })
  },
  Message: {
    user: async (message, args, {
      loaders
    }) => {
      return await loaders.user.load(message.userId);
    }
  },
  Subscription: {
    messageCreated: {
      subscribe: () => _subscription.default.asyncIterator(_subscription.EVENTS.MESSAGE.CREATED)
    }
  }
};
exports.default = _default;