"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "userphotos",
      [
        {
          filename: "female4.jpeg",
          path:
            "https://res.cloudinary.com/dtpaltm0r/image/upload/v1571782681/k049dtd6kbkk2mnfj2m3.jpg",
          userId: "1",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          filename: "man4.jpeg",
          path:
            "https://res.cloudinary.com/dtpaltm0r/image/upload/v1571782692/kxu2n2j6y83axld4g65u.jpg",
          userId: "2",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          filename: "lady2.jpeg",
          path:
            "https://res.cloudinary.com/dtpaltm0r/image/upload/v1571782713/qyjlyarycootdaoqzriw.jpg",
          userId: "3",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("userphotos", null, {});
  }
};

// npx sequelize-cli seed:generate --name users
