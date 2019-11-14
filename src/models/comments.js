const comment = (sequelize, DataTypes) => {
  const Comment = sequelize.define("comment", {
    text: {
      type: DataTypes.STRING
    },
    image: {
      type: DataTypes.STRING
    }
  });

  Comment.associate = models => {
    Comment.belongsTo(models.Workorder);
  };

  Comment.associate = models => {
    Comment.belongsTo(models.User);
  };

  return Comment;
};

export default comment;
