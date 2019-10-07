"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isMessageOwner = exports.isAdmin = exports.isAuthenticated = void 0;

var _apolloServer = require("apollo-server");

var _graphqlResolvers = require("graphql-resolvers");

const isAuthenticated = (parent, args, {
  me
}) => me ? _graphqlResolvers.skip : new _apolloServer.ForbiddenError('Not authenticated as user.');

exports.isAuthenticated = isAuthenticated;
const isAdmin = (0, _graphqlResolvers.combineResolvers)(isAuthenticated, (parent, args, {
  me: {
    role
  }
}) => role === 'ADMIN' ? _graphqlResolvers.skip : new _apolloServer.ForbiddenError('Not authorized as admin.'));
exports.isAdmin = isAdmin;

const isMessageOwner = async (parent, {
  id
}, {
  models,
  me
}) => {
  const message = await models.Message.findById(id, {
    raw: true
  });

  if (message.userId !== me.id) {
    throw new _apolloServer.ForbiddenError('Not authenticated as owner.');
  }

  return _graphqlResolvers.skip;
};

exports.isMessageOwner = isMessageOwner;