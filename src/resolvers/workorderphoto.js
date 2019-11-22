import Sequelize from "sequelize";
import { combineResolvers } from "graphql-resolvers";
import { isAuthenticated, isWorkorderOwner } from "./authorization";
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

export default {
  Query: {
    workorderphoto: async (parent, { id }, { models }) => {
      return await models.Workorderphoto.findAll({ where: { id: id } });
    },
    workorderphotos: async (parent, { workorderId }, { models }) => {
      return await models.Workorderphoto.findAll({
        where: { workorderId: workorderId }
      });
    },
    workorderphotosAll: async (parent, args, { models }) => {
      return await models.Workorderphoto.findAll();
    }
  },

  Mutation: {
    uploadWorkorderphoto: combineResolvers(
      isAuthenticated,
      async (
        parent,
        { photo, workorderId, primaryPhoto },
        { models, user }
      ) => {
        const { filename, createReadStream } = await photo;
        const workorder = await models.Workorder.findOne({
          where: {
            id: workorderId
          }
        });
        const wocount = await models.Workorderphoto.findOne({
          attributes: [
            "workorderId",
            [Sequelize.fn("COUNT", Sequelize.col("id")), "photocount"]
          ],
          where: { workorderId: workorderId },
          group: "workorderId"
        });
        let photocount;
        if (!wocount) {
          photocount = 1;
        } else {
          photocount = parseInt(wocount.dataValues.photocount) + 1;
        }
        const title = `wo_${workorderId}_photo_${photocount}_postedBy_user${user.id}`;
        let workorderphoto;
        try {
          const result = await new Promise((resolve, reject) => {
            createReadStream().pipe(
              cloudinary.uploader.upload_stream(
                {
                  use_filename: true
                },
                (error, result) => {
                  if (error) {
                    reject(error);
                  }
                  resolve(result);
                }
              )
            );
          });
          workorderphoto = await models.Workorderphoto.create({
            filename: title,
            path: result.secure_url,
            workorderId: workorderId,
            primaryPhoto: primaryPhoto,
            photocount: photocount,
            userId: user.id
          });
        } catch (err) {
          workorderphoto = err;
        }
        return workorderphoto;
      }
    ),
    editWorkorderphoto: combineResolvers(
      isAuthenticated,
      async (parent, { photo }, { models, user }) => {
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
          const workorderphoto = await models.Workorderphoto.findOne({
            where: {
              userId: user.id
            }
          });
          const userphoto = await workorderphoto.update({
            filename: result.public_id,
            path: result.secure_url,
            userId: user.id
          });
          return userphoto;
        } catch (err) {
          console.log(err);
        }
      }
    )
  }
};
