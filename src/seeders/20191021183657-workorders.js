"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "workorders",
      [
        {
          title: "paint the dining area",
          qrcode: "000001",
          userId: "19",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: "fix broken sink in unit 101",
          qrcode: "000002",
          userId: "14",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: "plant new tree outside",
          qrcode: "000003",
          userId: "15",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: "clean swimming pool",
          qrcode: "000004",
          userId: "16",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: "decorate outside for christmas",
          qrcode: "000005",
          userId: "17",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: "fix broken tile in mess hall",
          qrcode: "000006",
          userId: "18",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("workorders", null, {});
  }
};

// npx sequelize-cli seed:generate --name users
