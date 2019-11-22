"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _apolloServerExpress = require("apollo-server-express");

var _default = _apolloServerExpress.gql`
  extend type Query {
    users: [User!]
    user(id: ID!): User
    me: User
  }

  extend type Mutation {
    signUp(
      username: String!
      email: String!
      password: String!
      role: String
      phone: String!
      picture: String
      displayName: String
      authyId: String
    ): UserInfo!
    signIn(username: String!, password: String): SignIn!
    updateUser(username: String!): User!
    deleteUser(id: ID!): Boolean!
    verifyAuthy: UserInfo!
    signInDev(username: String!): Login!
    authyVerifyDev(username: String!, code: String!): Token!
  }

  type UserInfo {
    token: String!
    user: User
    authyId: String!
  }

  type Login {
    username: String!
  }

  type SignIn {
    token: String!
    user: User
    authyId: String!
    phone: String!
  }

  type Token {
    token: String!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    role: String
    phone: String!
    picture: String
    authyId: String
    displayName: String
    workorders: [Workorder!]
  }
`;

exports.default = _default;
module.exports = exports.default;