import { gql } from "apollo-server";

export default gql`
  extend type Query {
    users: [User!]
    user(id: ID!): User
    currentUser: User!
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
    token: String
    user: User
    authyId: String!
    phone: String!
  }

  type Token {
    token: String
    user: User
  }

  type Userphoto {
    path: String
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
    photo: Userphoto
  }
`;
