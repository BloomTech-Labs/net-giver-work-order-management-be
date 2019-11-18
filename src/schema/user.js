import { gql } from "apollo-server";

export default gql`
  extend type Query {
    users: [User!]
    user(id: ID!): User
    currentUser: User
    getCode(phone: String!, email: String!): cellPhone
  }

  extend type Mutation {
    registerAuthy(phone: String!, email: String!): signUpResponse!
    signUp(
      username: String
      email: String!
      password: String
      role: String
      phone: String!
      picture: String
      displayName: String
      authyId: String
    ): signUpResponse!
    verifyCode(
      authyId: String!
      code: String!
      code: String!
      email: String!
    ): UserInfo!
    signIn(username: String!, password: String): SignIn!
    updateUser(username: String!): User!
    deleteUser(id: ID!): Boolean!
    verifyAuthy: UserInfo!
    checkUsername(username: String!): UsernameResponse
    authyVerifyDev(username: String!, code: String!): Token!
    editUser(userInfo: UserInput!): User
  }

  input UserInput {
    photo: Upload
    username: String
    email: String
    role: String
    phone: String
    displayName: String
  }

  type signUpResponse {
    user: User
  }

  type cellPhone {
    cellPhone: String
  }

  type UsernameResponse {
    user: User
  }

  type UserInfo {
    token: String
    user: User
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
    username: String
    email: String
    role: String
    phone: String
    picture: String
    authyId: String
    displayName: String
    workorders: [Workorder!]
    photo: Userphoto
    token: String
  }
`;
