module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "Comment",
    {
      comment_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    { tableName: "comments" }
  );

  Comment.associate = function (models) {
    Comment.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user_comments",
    });

    Comment.belongsTo(models.Ledger, {
      foreignKey: "ledgerId",
      as: "ledger_comments",
    });
  };
  return Comment;
};
