"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.sequelize = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const sequelize = new Sequelize(
//   "postgres://bryant@localhost:5432/graphql_postgres"
// );
let sequelize;
exports.sequelize = sequelize;

if (process.env.DATABASE_URL) {
  exports.sequelize = sequelize = new _sequelize.default(process.env.DATABASE_URL, {
    dialect: "postgres"
  });
} else {
  exports.sequelize = sequelize = new _sequelize.default(process.env.TEST_DATABASE || process.env.DATABASE, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    dialect: "postgres",
    host: "/Users/bryant/Library/Application Support/Postgres/var-11"
  });
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