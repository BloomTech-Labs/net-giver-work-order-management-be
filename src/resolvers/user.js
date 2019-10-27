import jwt from "jsonwebtoken";
import { combineResolvers } from "graphql-resolvers";
import { AuthenticationError, UserInputError } from "apollo-server";

import {
  isAdmin,
  isAuthenticated,
  isAuthyAuthenticated
} from "./authorization";
import photos from "./photos";
import { Client } from "authy-client";
import authy from "authy";

const createToken = async (user, secret, expiresIn) => {
  const { id, email, username, role } = user;
  return await jwt.sign({ id, email, username, role }, secret, {
    expiresIn
  });
};

let client;
if (process.env.ACCOUNT_SECURITY_API_KEY) {
  client = new Client({ key: process.env.ACCOUNT_SECURITY_API_KEY });
} else {
  client = new Client({ key: "foo" });
}

const registerAuthy = async ({ email, phone }) => {
  //const { user: { id: authyId } } = await client.registerUser({
  const register = await client.registerUser({
    countryCode: "US",
    email: email,
    phone: phone
  });
  const { user: { id: authyId } } = register;
  //const authyreq = await client.requestSms({ authyId });
  //const { cellphone } = authyreq;
  return authyId;
};

const sms = async authyId => {
  const smsRequest = await client.requestSms({ authyId });
  const { cellphone } = smsRequest;
  return cellphone;
};

const verifyToken = async (authyId, cdde) => {
  const smsRequest = await client.verifyToken({ authyId, code });
  const { cellphone } = smsRequest;
  return cellphone;
};

export default {
  Query: {
    users: async (parent, args, { models }) => {
      return await models.User.findAll();
    },
    user: async (parent, { id }, { models }) => {
      return await models.User.findByPk(id);
    },
    me: async (parent, args, { models, me }) => {
      if (!me) {
        return null;
      }

      return await models.User.findByPk(me.id);
    }
  },

  Mutation: {
    signUp: async (
      parent,
      { username, email, password, phone, picture, displayName },
      { models, secret }
    ) => {
      const authyId = await registerAuthy({ email, phone });
      const user = await models.User.create({
        username,
        email,
        password,
        phone,
        picture,
        displayName,
        authyId
      });
      const token = createToken(user, secret, "14d");

      return { token: token, user: user, authyId: authyId };
    },

    signIn: async (parent, { username, password }, { models, secret }) => {
      const user = await models.User.findByLogin(username);
      if (!user) {
        throw new UserInputError("No user found with this login credentials.");
      }
      if (password) {
        const isValid = await user.validatePassword(password);

        if (!isValid) {
          throw new AuthenticationError("Invalid password.");
        }
      }

      const token = createToken(user, secret, "14d");
      const { authyId } = user;
      const smsRequest = await client.requestSms({ authyId });
      const { cellphone } = smsRequest;

      return { token: token, user: user, authyId: authyId, phone: cellphone };

      // return { token: createToken(user, secret, "30m") };
    },

    signInDev: async (parent, { username }, { models, secret }) => {
      const user = await models.User.findByLogin(username);
      if (!user) {
        throw new UserInputError("No user found with this login credentials.");
      }

      const { authyId } = user;
      if (!authyId) {
        throw new UserInputError("User has not registered with Authy.");
      }
      return { username: user.username };
    },

    authyVerifyDev: async (parent, { username, code }, { models, secret }) => {
      const user = await models.User.findByLogin(username);
      if (!user) {
        throw new UserInputError("No user found with this login credentials.");
      }
      if (code !== "123456") {
        throw new UserInputError("Wrong Auth Code. Try 123456");
      }
      const token = createToken(user, secret, "30m");
      return { token: token };
    },

    updateUser: combineResolvers(
      isAuthenticated,
      async (parent, { username }, { models, me }) => {
        const user = await models.User.findByPk(me.id);
        return await user.update({ username });
      }
    ),
    deleteUser: combineResolvers(
      isAdmin,
      async (parent, { id }, { models }) => {
        return await models.User.destroy({
          where: { id }
        });
      }
    ),
    verifyAuthy: combineResolvers(
      isAuthenticated,
      async (parent, { token }, { models, me }) => {
        const user = await models.User.findByPk(me.id);
        const { authyId } = user;
        const authyreq = client.verifyToken({ authyId: authyId, token: token });
        const { cellphone } = authyreq;
        return cellphone;
      }
    )
  },

  User: {
    workorders: async (user, args, { models }) => {
      return await models.Workorder.findAll({
        where: {
          userId: user.id
        }
      });
    },
    photo: async (user, args, { models }) => {
      return await models.Userphoto.findOne({
        // attributes: [["path", "photourl"]],
        where: {
          userId: user.id
        }
      });
    }
  }
};
