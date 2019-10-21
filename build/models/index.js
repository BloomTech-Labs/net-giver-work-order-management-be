"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.sequelize = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const path = require("path");

const env = process.env.NODE_ENV || "development";

const config = require(__dirname + "/../config/config.js")[env];

let sequelize;
exports.sequelize = sequelize;

if (config.use_env_variable) {
  exports.sequelize = sequelize = new _sequelize.default(process.env[config.use_env_variable], config);
} else {
  exports.sequelize = sequelize = new _sequelize.default(config.database, config.username, config.password, config);
}

const models = {
  User: sequelize.import("./user"),
  Workorder: sequelize.import("./workorder")
};
Object.keys(models).forEach(key => {
  if ("associate" in models[key]) {
    models[key].associate(models);
  }
});
var _default = models;
exports.default = _default;