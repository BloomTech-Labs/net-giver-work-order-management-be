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
      type: DataTypes.STRING,
      values: ["Complete", "In Progress", "Not Started"],
      defaultValue: "Not Started"
    },
    priority: {
      type: DataTypes.STRING,
      values: ["Low", "Medium", "High", "Emergency"],
      defaultValue: "Low"
    },
    detail: {
      type: DataTypes.STRING
    }
  });

  Workorder.associate = models => {
    Workorder.belongsTo(models.User);
  };

  return Workorder;
};

export default workorder;
