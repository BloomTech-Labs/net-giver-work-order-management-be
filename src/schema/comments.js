import { gql } from "apollo-server";

export default gql`
  extend type Query {
    comments(workorderId: ID): [Comment]
    comment(id: ID): Comment
  }

  input CommentInput {
    text: String
    workorderId: ID!
    photo: Upload
  }

  type Comment {
    id: ID!
    text: String
    createdAt: DateTime!
    workorderId: ID!
    user: User
    image: String
  }

  type CommentCreated {
    comment: Comment!
  }

  extend type Subscription {
    commentCreated(id: ID!): CommentCreated!
  }

  extend type Mutation {
    addComment(comment: CommentInput): Comment
    deleteComment(id: ID!): Boolean!
  }
`;
