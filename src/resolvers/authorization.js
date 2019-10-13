import { ForbiddenError } from "apollo-server";
import { combineResolvers, skip } from "graphql-resolvers";

export const isAuthenticated = (parent, args, { me }) =>
  me ? skip : new ForbiddenError("Not authenticated as user.");

export const isAdmin = combineResolvers(
  isAuthenticated,
  (parent, args, { me: { role } }) =>
    role === "ADMIN" ? skip : new ForbiddenError("Not authorized as admin.")
);

export const isWorkorderOwner = async (parent, { id }, { models, me }) => {
  const workorder = await models.Workorder.findByPk(id, { raw: true });

  if (workorder.userId !== me.id) {
    throw new ForbiddenError("Not authenticated as owner.");
  }

  return skip;
};

// export const createToken = async (user, secret, expiresIn) => {
//   const { id, email, username, role } = user;
//   return await jwt.sign({ id, email, username, role }, secret, {
//     expiresIn
//   });
// };

// let client;
// if (process.env.ACCOUNT_SECURITY_API_KEY) {
//   client = new Client({ key: process.env.ACCOUNT_SECURITY_API_KEY });
// } else {
//   client = new Client({ key: "foo" });
// }

// export const registerAuthy = async () => {
//   const { user: { id: authyId } } = await client.registerUser({
//     countryCode: "US",
//     email: "foo@bar.com",
//     phone: "14153163549"
//   });
//   const authyreq = await client.requestSms({ authyId });
//   const { cellphone } = authyreq;
//   return cellphone;
//   console.log(`SMS requested to ${authyreq}`);
// };
