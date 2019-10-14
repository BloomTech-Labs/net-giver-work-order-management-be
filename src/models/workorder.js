const workorder = (sequelize, DataTypes) => {
  const Workorder = sequelize.define("workorder", {
    title: {
      type: DataTypes.STRING
    },
    qrcode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [5]
      }
    },
    status: {
      type: DataTypes.STRING
    },
    priority: {
      type: DataTypes.STRING
    },
    detail: {
      type: DataTypes.STRING
    }
  });

  Workorder.associate = models => {
    Workorder.belongsTo(models.User);
  };
  // Workorder.associate = models => {
  //   Workorder.hasMany(models.Qrcode, { onDelete: "CASCADE" });
  // };

  return Workorder;
};

export default workorder;
