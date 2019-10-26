"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "workorderphotos",
      [
        {
          filename: "irmahouse082019_gyckuf.jpeg",
          path:
            "https://res.cloudinary.com/dtpaltm0r/image/upload/v1572033774/workorders/irmahouse082019_gyckuf.jpg",
          workorderId: "1",
          primaryPhoto: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          filename: "broken-sink_zjxgwk.jpeg",
          path:
            "https://res.cloudinary.com/dtpaltm0r/image/upload/v1572033710/workorders/broken-sink_zjxgwk.jpg",
          workorderId: "1",
          primaryPhoto: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          filename: "irmahouse082019_gyckuf.jpeg",
          path:
            "https://res.cloudinary.com/dtpaltm0r/image/upload/v1572033774/workorders/irmahouse082019_gyckuf.jpg",
          workorderId: "2",
          primaryPhoto: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          filename: "broken-sink_zjxgwk.jpeg",
          path:
            "https://res.cloudinary.com/dtpaltm0r/image/upload/v1572033710/workorders/broken-sink_zjxgwk.jpg",
          workorderId: "2",
          primaryPhoto: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          filename: "irmahouse082019_gyckuf.jpeg",
          path:
            "https://res.cloudinary.com/dtpaltm0r/image/upload/v1572033774/workorders/irmahouse082019_gyckuf.jpg",
          workorderId: "3",
          primaryPhoto: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          filename: "broken-sink_zjxgwk.jpeg",
          path:
            "https://res.cloudinary.com/dtpaltm0r/image/upload/v1572033710/workorders/broken-sink_zjxgwk.jpg",
          workorderId: "3",
          primaryPhoto: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("workorderphotos", null, {});
  }
};

// npx sequelize-cli seed:generate --name users
