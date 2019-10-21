"use strict";
module.exports = (sequelize, DataTypes) => {
  const TestUser = sequelize.define(
    "TestUser",
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING
    },
    {}
  );
  TestUser.associate = function(models) {
    // associations can be defined here
  };
  return TestUser;
};
