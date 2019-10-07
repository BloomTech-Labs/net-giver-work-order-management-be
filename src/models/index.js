import Sequelize from "sequelize";

// const sequelize = new Sequelize(
//   "postgres://bryant@localhost:5432/graphql_postgres"
// );

let sequelize;
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres"
  });
} else {
  sequelize = new Sequelize(
    process.env.TEST_DATABASE || process.env.DATABASE,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    {
      dialect: "postgres",
      host: "/Users/bryant/Library/Application Support/Postgres/var-11"
    }
  );
}

const models = {
  User: sequelize.import("./user"),
  Message: sequelize.import("./message")
};

Object.keys(models).forEach(key => {
  if ("associate" in models[key]) {
    models[key].associate(models);
  }
});

export { sequelize };

export default models;
