import Sequelize from "sequelize";
import { combineResolvers } from "graphql-resolvers";

import pubsub, { EVENTS } from "../subscription";
import { isAuthenticated, isWorkorderOwner } from "./authorization";

const toCursorHash = string => Buffer.from(string).toString("base64");

const fromCursorHash = string =>
  Buffer.from(string, "base64").toString("ascii");

export default {
  Query: {
    workorders: async (parent, { cursor, limit = 100 }, { models }) => {
      const cursorOptions = cursor
        ? {
            where: {
              createdAt: {
                [Sequelize.Op.lt]: fromCursorHash(cursor)
              }
            }
          }
        : {};

      const workorders = await models.Workorder.findAll({
        order: [["createdAt", "DESC"]],
        limit: limit + 1,
        ...cursorOptions
      });

      const hasNextPage = workorders.length > limit;
      const edges = hasNextPage ? workorders.slice(0, -1) : workorders;

      return {
        edges,
        pageInfo: {
          hasNextPage,
          endCursor: toCursorHash(edges[edges.length - 1].createdAt.toString())
        }
      };
    },
    workorder: async (parent, { id }, { models }) => {
      return await models.Workorder.findByPk(id);
    }
  },

  Mutation: {
    createWorkorder: combineResolvers(
      isAuthenticated,
      async (parent, { order, qrcode }, { models, me }) => {
        const workorder = await models.Workorder.create({
          order,
          qrcode,
          userId: me.id
        });

        pubsub.publish(EVENTS.WORKORDER.CREATED, {
          workorderCreated: { workorder }
        });

        return workorder;
      }
    ),

    deleteWorkorder: combineResolvers(
      isAuthenticated,
      isWorkorderOwner,
      async (parent, { id }, { models }) => {
        return await models.Workorder.destroy({ where: { id } });
      }
    )
  },

  Workorder: {
    user: async (workorder, args, { loaders }) => {
      return await loaders.user.load(workorder.userId);
    }
  },

  Subscription: {
    workorderCreated: {
      subscribe: () => pubsub.asyncIterator(EVENTS.WORKORDER.CREATED)
    }
  }
};
