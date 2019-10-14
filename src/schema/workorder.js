import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    workorders(cursor: String, limit: Int): WorkorderConnection!
    workorder(id: ID!): Workorder!
  }

  extend type Mutation {
    createWorkorder(order: String!, qrcode: String!): Workorder!
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
    id: ID!
    order: String!
    createdAt: Date!
    user: User!
    qrcode: String!
  }

  extend type Subscription {
    workorderCreated: WorkorderCreated!
  }

  type WorkorderCreated {
    workorder: Workorder!
  }
`;
