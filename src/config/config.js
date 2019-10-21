require("dotenv").config();
module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    dialect: "postgres"
  },
  test: {
    database: process.env.TEST_DATABASE,
    dialect: "postgres"
  },
  production: {
    database: process.env.DATABASE_URL,
    dialect: "postgres"
  }
};
