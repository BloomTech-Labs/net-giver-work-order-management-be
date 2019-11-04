import { DataSource } from "apollo-datasource";
import Sequelize from "sequelize";

const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];

const createStore = () => {
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
    User: sequelize.import("../models/user"),
    Workorder: sequelize.import("../models/workorder"),
    Userphoto: sequelize.import("../models/userphoto"),
    Workorderphoto: sequelize.import("../models/workorderphoto")
  };
  Object.keys(models).forEach(key => {
    if ("associate" in models[key]) {
      models[key].associate(models);
    }
  });
};

class WorkOrderAPI extends DataSource {
  constructor() {
    super();
    this.store = createStore();
  }

  async getUsers() {
    return await this.store.models.User.findAll();
  }
}

export default WorkOrderAPI;
