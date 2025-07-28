module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define("Comment", {}, { tableName: "comments" });
  return Comment;
};
