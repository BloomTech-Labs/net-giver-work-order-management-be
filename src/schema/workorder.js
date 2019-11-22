import { gql } from "apollo-server";

export default gql`
  extend type Query {
    workorders(cursor: String, limit: Int): WorkorderConnection!
    workorder(qrcode: String, id: ID): Workorder!
  }

  extend type Mutation {
    createWorkorder(qrcode: String!): Workorder!
    editWorkorder(
      id: ID
      qrcode: String
      detail: String
      priority: String
      status: String
      title: String
    ): Workorder!
    deleteWorkorder(id: ID!): Boolean!
    workorderEdit(workorder: WorkorderInput): Workorder!
    qrlookup(qrcode: String!): Qrlookup!
  }

  type WorkorderConnection {
    edges: [Workorder!]!
    pageInfo: PageInfo!
  }

  # pagesleft or total num records

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String!
    # workordercount: Int!
  }

  type Qrlookup {
    found: Boolean!
    id: ID
    qrcode: String
  }

  input WorkorderInput {
    id: ID!
    photo: Upload
    detail: String
    priority: String
    status: String
    title: String
    qrcode: String
  }

  type Workorder {
    id: ID!
    detail: String
    createdAt: Date!
    user: User!
    qrcode: String
    priority: String
    status: String
    title: String
    userId: ID
    isCompleted: Boolean
    workorderphotos: [Workorderphoto!]
    workorderphoto: Workorderphoto
    comments: [Comment]
  }

  extend type Subscription {
    workorderCreated: WorkorderCreated!
  }

  type WorkorderCreated {
    workorder: Workorder!
  }
`;
