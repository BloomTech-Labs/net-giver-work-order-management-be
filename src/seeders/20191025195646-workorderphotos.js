"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "workorderphotos",
      [
        {
          filename: "wo_1_photo_1_postedBy_user1",
          path:
            "https://res.cloudinary.com/dtpaltm0r/image/upload/v1572033774/workorders/irmahouse082019_gyckuf.jpg",
          workorderId: "1",
          primaryPhoto: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          photocount: 1,
          userId: "1"
        },
        {
          filename: "wo_1_photo_2_postedBy_user3",
          path:
            "https://res.cloudinary.com/dtpaltm0r/image/upload/v1572033710/workorders/broken-sink_zjxgwk.jpg",
          workorderId: "1",
          primaryPhoto: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          photocount: 2,
          userId: "3"
        },
        {
          filename: "wo_2_photo_1_postedBy_user2",
          path:
            "https://res.cloudinary.com/dtpaltm0r/image/upload/v1572033774/workorders/irmahouse082019_gyckuf.jpg",
          workorderId: "2",
          primaryPhoto: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          photocount: 1,
          userId: "2"
        },
        {
          filename: "wo_2_photo_2_postedBy_user4",
          path:
            "https://res.cloudinary.com/dtpaltm0r/image/upload/v1572033710/workorders/broken-sink_zjxgwk.jpg",
          workorderId: "2",
          primaryPhoto: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          photocount: 2,
          userId: "4"
        },
        {
          filename: "wo_3_photo_1_postedBy_user3",
          path:
            "https://res.cloudinary.com/dtpaltm0r/image/upload/v1572033774/workorders/irmahouse082019_gyckuf.jpg",
          workorderId: "3",
          primaryPhoto: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          photocount: 1,
          userId: "3"
        },
        {
          filename: "wo_3_photo_2_postedBy_user5",
          path:
            "https://res.cloudinary.com/dtpaltm0r/image/upload/v1572033710/workorders/broken-sink_zjxgwk.jpg",
          workorderId: "3",
          primaryPhoto: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          photocount: 2,
          userId: "5"
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
