const { ENUM, BOOLEAN } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const SupportPost = sequelize.define(
    "SupportPost",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      post_type: {
        type: DataTypes.ENUM("notice", "update", "guide"),
        defaultValue: "notice",
        allowNull: false,
      },
      fileName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    { tableName: "support_posts" }
  );
  SupportPost.associate = function (models) {
    SupportPost.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  };
  return SupportPost;
};
