"use strict";
import bcrypt from "bcrypt";
const user = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      username: {
        type: DataTypes.STRING,
        allowNull: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true
      },
      role: {
        type: DataTypes.STRING
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [10]
        }
      },
      picture: {
        type: DataTypes.STRING
      },
      authyId: {
        type: DataTypes.STRING,
        allowNull: true
      },
      displayName: {
        type: DataTypes.STRING
      },
      isProfileComplete: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {}
  );
  User.associate = models => {
    User.hasOne(models.Userphoto, { onDelete: "CASCADE" });
  };
  User.associate = models => {
    User.hasMany(models.Workorder, { onDelete: "CASCADE" });
  };

  User.findByLogin = async login => {
    let user = await User.findOne({
      where: { username: login }
    });

    if (!user) {
      user = await User.findOne({
        where: { email: login }
      });
    }

    return user;
  };

  return User;
};

export default user;

// npx sequelize-cli model:generate --name User --attributes username:string,email:string,password:string,role:string,phone:string,picture:string,authyId:string,displayName:string,isProfileComplete:boolean
