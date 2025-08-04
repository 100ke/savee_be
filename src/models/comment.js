module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "Comment",
    {
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      comment_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ledgerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "comments",
      indexes: [
        {
          unique: true,
          fields: ["ledgerId", "comment_date", "userId"],
        },
      ],
    }
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
