import jwt from "jsonwebtoken";
import { combineResolvers } from "graphql-resolvers";
import {
  AuthenticationError,
  UserInputError,
  ApolloError
} from "apollo-server";
import {
  isAdmin,
  isAuthenticated,
  isAuthyVerfied,
  isAuthyAuthenticated
} from "./authorization";
import { Client } from "authy-client";
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const createToken = async (user, secret) => {
  const { id, email, username, role } = user;
  const token = await jwt.sign({ id, email, username, role }, secret, {
    expiresIn: "30d"
  });
  return token;
};

let client;
if (process.env.ACCOUNT_SECURITY_API_KEY) {
  client = new Client({ key: process.env.ACCOUNT_SECURITY_API_KEY });
} else {
  client = new Client({ key: "foo" });
}

const registerUser = async ({ email, phone }) => {
  //const { user: { id: authyId } } = await client.registerUser({
  const register = await client.registerUser({
    countryCode: "US",
    email: email,
    phone: phone
  });
  console.log(register);
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
    currentUser: async (parent, args, { user, models }) => {
      if (!user) {
        return null;
      }

      return await models.User.findByPk(user.id);
    },
    getCode: async (parent, { email, phone }, { models, secret }) => {
      const user = await models.User.findByLogin(email);
      if (!user) {
        throw new UserInputError("No user found with this login credentials.");
      }
      const { authyId } = user;
      const smsRequest = await client.requestSms({ authyId });
      const { cellphone } = smsRequest;

      return cellphone;
    }
  },

  Mutation: {
    registerAuthy: async (parent, { email, phone }, { models }) => {
      const userAlreadyExists = await models.User.findOne({
        where: { email },
        select: ["id"]
      });

      if (userAlreadyExists) {
        throw new ApolloError("User already exists.");
      }
      const authyId = await registerUser({ email, phone });
      const user = await models.User.create({
        email,
        phone,
        authyId
      });

      return { user: user };
    },
    verifyCode: async (
      parent,
      { authyId, code, email },
      { models, secret }
    ) => {
      try {
        const authyreq = await client.verifyToken({
          authyId: authyId,
          token: code
        });

        const { success } = authyreq;
        const user = await models.User.findByLogin(email);
        const token = createToken(user, secret);
        return { user: user, token: token };
      } catch (err) {
        console.log("Verify Token Error: ", err);
        throw new ApolloError(err.message);
      }
    },
    signIn: async (parent, { username, password }, { models, secret }) => {
      const user = await models.User.findByLogin(username);
      if (!user) {
        throw new ApolloError("No user found with this login credentials.");
      }
      if (password) {
        const isValid = await user.validatePassword(password);

        if (!isValid) {
          throw new AuthenticationError("Invalid password.");
        }
      }
      const token = createToken(user, secret);
      const { authyId } = user;
      const smsRequest = await client.requestSms({ authyId });
      const { cellphone } = smsRequest;

      return { token: token, user: user, authyId: authyId, phone: cellphone };

      // return { token: createToken(user, secret, "30m") };
    },

    checkUsername: async (parent, { username }, { models, secret }) => {
      try {
        const user = await models.User.findByLogin(username);
        if (!user) {
          throw new ApolloError("No user found with this login credentials.");
        }

        const { authyId } = user;

        if (!authyId) {
          throw new ApolloError("User has not registered with Authy.");
        }
        return { user: user };
      } catch (err) {
        throw new ApolloError(err.message);
      }
    },

    authyVerifyDev: async (parent, { username, code }, { models, secret }) => {
      const user = await models.User.findByLogin(username);
      if (!user) {
        throw new UserInputError("No user found with this login credentials.");
      }
      if (code !== "123456") {
        throw new UserInputError("Wrong Auth Code. Try 123456");
      }
      const token = createToken(user, secret);
      return { token: token, user: user };
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
    ),
    editUser: combineResolvers(
      isAuthenticated,
      async (parent, { userInfo }, { models, user }) => {
        const { username, photo } = userInfo;
        const userExists = await models.User.findByPk(user.id);
        if (!userExists) {
          throw new ApolloError("User ID doesnt exist .");
        }
        let url;
        if (photo) {
          const { filename, createReadStream } = await photo;
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
            await models.Userphoto.create({
              filename: result.public_id,
              path: result.secure_url,
              userId: user.id
            });
            url = result.secure_url;
          } catch (err) {
            throw new ApolloError(err.message);
          }
        }
        try {
          return await userExists.update({ username });
        } catch (err) {
          throw new ApolloError(err.message);
        }
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
