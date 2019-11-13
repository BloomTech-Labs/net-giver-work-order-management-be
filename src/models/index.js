"use strict";
import Sequelize from "sequelize";

const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

const models = {
  User: sequelize.import("./user"),
  Workorder: sequelize.import("./workorder"),
  Userphoto: sequelize.import("./userphoto"),
  Workorderphoto: sequelize.import("./workorderphoto"),
  Comment: sequelize.import("./comments")
};

Object.keys(models).forEach(key => {
  if ("associate" in models[key]) {
    models[key].associate(models);
  }
});

export { sequelize };

export default models;
