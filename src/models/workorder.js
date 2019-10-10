const workorder = (sequelize, DataTypes) => {
  const Workorder = sequelize.define("workorder", {
    order: {
      type: DataTypes.STRING,
      validate: { notEmpty: true }
    }
  });

  Workorder.associate = models => {
    Workorder.belongsTo(models.User);
  };

  return Workorder;
};

export default workorder;
