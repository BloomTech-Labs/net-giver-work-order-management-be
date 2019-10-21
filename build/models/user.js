"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _bcrypt = _interopRequireDefault(require("bcrypt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const user = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [5, 42]
      }
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
      type: DataTypes.STRING,
      unique: true
    },
    isProfileComplete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {});

  User.associate = models => {
    User.hasMany(models.Workorder, {
      onDelete: "CASCADE"
    });
  };

  User.findByLogin = async login => {
    let user = await User.findOne({
      where: {
        username: login
      }
    });

    if (!user) {
      user = await User.findOne({
        where: {
          email: login
        }
      });
    }

    return user;
  };

  User.beforeCreate(async user => {
    user.password = await user.generatePasswordHash();
  });

  User.prototype.generatePasswordHash = async function () {
    const saltRounds = 10;
    return await _bcrypt.default.hash(this.password, saltRounds);
  };

  User.prototype.validatePassword = async function (password) {
    return await _bcrypt.default.compare(password, this.password);
  };

  return User;
};

var _default = user; // npx sequelize-cli model:generate --name User --attributes username:string,email:string,password:string,role:string,phone:string,picture:string,authyId:string,displayName:string,isProfileComplete:boolean

exports.default = _default;
module.exports = exports.default;