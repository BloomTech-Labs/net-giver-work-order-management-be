"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "users",
      [
        {
          username: "bryant",
          email: "bryantpatton@gmail.com",
          password: "bryant",
          role: "ADMIN",
          phone: "4153163549",
          authyId: "82620055",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          username: "skylerd",
          email: "skyler2440@gmail.com",
          password: "password",
          role: "ADMIN",
          phone: "3523904132",
          authyId: "190296236",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          username: "lauradd",
          email: "lauradondiego@gmail.com",
          password: "password",
          role: "ADMIN",
          phone: "9089070012",
          authyId: "199476194",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          username: "bryangf",
          email: "test@mail2.com",
          password: "password",
          role: "ADMIN",
          phone: "2065486129",
          authyId: "65740527",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          username: "ryanm",
          email: "ryan@mail.com",
          password: "password",
          role: "ADMIN",
          phone: "9729748268",
          authyId: "196958398",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          username: "georgek",
          email: "pete@plumber.com",
          password: "password",
          role: "ADMIN",
          phone: "5127090470",
          authyId: "198579923",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("users", null, {});
  }
};

// npx sequelize-cli seed:generate --name users
