const userphoto = (sequelize, DataTypes) => {
  const Userphoto = sequelize.define("userphoto", {
    filename: { type: DataTypes.STRING },
    path: { type: DataTypes.STRING }
  });

  Userphoto.associate = models => {
    Userphoto.belongsTo(models.User);
  };

  return Userphoto;
};

export default userphoto;
