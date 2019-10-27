import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    workorderphoto(id: ID): Workorderphoto
    workorderphotos(workorderId: ID): [Workorderphoto]
    workorderphotosAll: [Workorderphoto]
  }

  type Workorderphoto {
    id: ID!
    filename: String!
    path: String!
    createdAt: Date!
    workorderId: ID!
    primaryPhoto: Boolean!
    photocount: Int!
    userId: ID!
    commentId: ID
  }

  extend type Mutation {
    uploadWorkorderphoto(
      photo: Upload!
      workorderId: ID!
      primaryPhoto: Boolean!
      commentId: ID
    ): Workorderphoto!
    editWorkorderphoto(photo: Upload!): Workorderphoto!
  }
`;
