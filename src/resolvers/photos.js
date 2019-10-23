import Sequelize from "sequelize";
import { combineResolvers } from "graphql-resolvers";

import pubsub, { EVENTS } from "../subscription";
import { isAuthenticated, isWorkorderOwner } from "./authorization";
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const photos = [];

export default {
  Query: {
    allPhotos() {
      return photos;
    },
    profilePhotos: async (parent, args, { models }) => {
      return await models.Userphoto.findAll();
    }
  },

  Mutation: {
    uploadPhoto: combineResolvers(
      isAuthenticated,
      async (parent, { photo }, { models, me }) => {
        const { filename, createReadStream } = await photo;
        try {
          const result = await new Promise((resolve, reject) => {
            createReadStream().pipe(
              cloudinary.uploader.upload_stream((error, result) => {
                if (error) {
                  reject(error);
                }
                resolve(result);
              })
            );
          });

          const newPhoto = { filename, path: result.secure_url };
          photos.push(newPhoto);
          return newPhoto;
        } catch (err) {
          console.log(err);
        }
      }
    ),
    uploadUserPhoto: combineResolvers(
      isAuthenticated,
      async (parent, { photo }, { models, me }) => {
        const { filename, createReadStream } = await photo;
        try {
          const result = await new Promise((resolve, reject) => {
            createReadStream().pipe(
              cloudinary.uploader.upload_stream((error, result) => {
                if (error) {
                  reject(error);
                }
                resolve(result);
              })
            );
          });
          const userphoto = await models.Userphoto.create({
            filename: result.public_id,
            path: result.secure_url,
            userId: me.id
          });
          return userphoto;
        } catch (err) {
          console.log(err);
        }
      }
    ),
    editUserPhoto: combineResolvers(
      isAuthenticated,
      async (parent, { photo }, { models, me }) => {
        const { filename, createReadStream } = await photo;
        try {
          const result = await new Promise((resolve, reject) => {
            createReadStream().pipe(
              cloudinary.uploader.upload_stream((error, result) => {
                if (error) {
                  reject(error);
                }
                resolve(result);
              })
            );
          });
          const photo = await models.Userphoto.findOne({
            where: {
              userId: me.id
            }
          });
          const userphoto = await photo.update({
            filename: result.public_id,
            path: result.secure_url,
            userId: me.id
          });
          return userphoto;
        } catch (err) {
          console.log(err);
        }
      }
    )
  }
};
