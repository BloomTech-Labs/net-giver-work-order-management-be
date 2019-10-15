import { ForbiddenError } from "apollo-server";
import { combineResolvers, skip } from "graphql-resolvers";

export const isAuthenticated = (parent, args, { me }) =>
  //remove authentication
  // me ? skip : new ForbiddenError("Not authenticated as user.");
  me ? skip : skip;

export const isAdmin = combineResolvers(
  isAuthenticated,
  (parent, args, { me: { role } }) =>
    role === "ADMIN" ? skip : new ForbiddenError("Not authorized as admin.")
);

export const isWorkorderOwner = async (parent, { id }, { models, me }) => {
  const workorder = await models.Workorder.findByPk(id, { raw: true });

  if (workorder.userId !== me.id) {
    // remove ownership requirement
    // throw new ForbiddenError("Not authenticated as owner.");
    return skip;
  }

  return skip;
};

export const isAuthyAuthenticated = (parent, args, { code }) =>
  code === "123456" ? skip : new ForbiddenError("Not authenticated as user.");
