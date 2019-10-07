"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.batchUsers = void 0;

const batchUsers = async (keys, models) => {
  const users = await models.User.findAll({
    where: {
      id: {
        $in: keys
      }
    }
  });
  return keys.map(key => users.find(user => user.id === key));
};

exports.batchUsers = batchUsers;