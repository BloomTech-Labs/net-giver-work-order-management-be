const workorderphoto = (sequelize, DataTypes) => {
  const Workorderphoto = sequelize.define("workorderphoto", {
    filename: { type: DataTypes.STRING },
    path: { type: DataTypes.STRING },
    primaryPhoto: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    photocount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    userId: {
      type: DataTypes.INTEGER
    }
  });

  Workorderphoto.associate = models => {
    Workorderphoto.belongsTo(models.Workorder);
  };

  return Workorderphoto;
};

export default workorderphoto;
