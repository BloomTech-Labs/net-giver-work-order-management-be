"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("workorders", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      qrcode: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          len: [5]
        }
      },
      status: {
        type: Sequelize.STRING,
        values: ["Complete", "In Progress", "Not Started"],
        defaultValue: "Not Started"
      },
      priority: {
        type: Sequelize.STRING,
        values: ["Low", "Medium", "High", "Emergency"],
        defaultValue: "Low"
      },
      detail: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "users"
          },
          key: "id"
        },
        allowNull: false
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("workorders");
  }
};
