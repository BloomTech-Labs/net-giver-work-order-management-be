import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    workorders(cursor: String, limit: Int): WorkorderConnection!
    workorder(qrcode: String!): Workorder!
  }

  extend type Mutation {
    createWorkorder(qrcode: String!): Workorder!
    editWorkorder(
      qrcode: String!
      detail: String
      priority: String
      status: String
      title: String
    ): Workorder!
    deleteWorkorder(id: ID!): Boolean!
  }

  type WorkorderConnection {
    edges: [Workorder!]!
    pageInfo: PageInfo!
  }

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String!
  }

  type Workorder {
    id: ID
    detail: String
    createdAt: Date!
    user: User!
    qrcode: String!
    priority: String
    status: String
    title: String
  }

  extend type Subscription {
    workorderCreated: WorkorderCreated!
  }

  type WorkorderCreated {
    workorder: Workorder!
  }
`;
