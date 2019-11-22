import { ForbiddenError, ApolloError } from "apollo-server";
import { combineResolvers, skip } from "graphql-resolvers";

export const isAuthenticated = (parent, args, { user }) =>
  user ? skip : new ForbiddenError("NOT_AUTHENTICATED");

export const isAuthyVerfied = (parent, args, { user }) =>
  user.verfied ? skip : new ForbiddenError("Not authenticated as user.");

export const isAdmin = combineResolvers(
  isAuthenticated,
  (parent, args, { user: { role } }) =>
    role === "ADMIN" ? skip : new ForbiddenError("Not authorized as admin.")
);

export const isWorkorderOwner = async (parent, { id }, { models, user }) => {
  const workorder = await models.Workorder.findByPk(id, { raw: true });

  if (workorder.userId !== user.id) {
    throw new ForbiddenError("Not authenticated as owner.");
  }

  return skip;
};

export const isAuthyAuthenticated = (parent, args, { code }) =>
  code === "123456" ? skip : new ForbiddenError("Not authenticated as user.");
