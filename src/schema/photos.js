import { gql } from "apollo-server";

export default gql`
  type Photo {
    filename: String!
    path: String!
  }

  type Profilephoto {
    userId: ID
    filename: String!
    path: String!
  }

  extend type Query {
    allPhotos: [Photo]
    profilePhotos: [Profilephoto]
  }

  extend type Mutation {
    uploadPhoto(photo: Upload!): Photo!
    uploadUserPhoto(photo: Upload!): Profilephoto!
    editUserPhoto(photo: Upload!): Profilephoto!
  }
`;
