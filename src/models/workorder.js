const workorder = (sequelize, DataTypes) => {
  const Workorder = sequelize.define("workorder", {
    order: {
      type: DataTypes.STRING,
      validate: { notEmpty: true }
    },
    qrcode: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [5]
      }
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
