module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
    {},
    { tableName: "categories" }
  );
  return Category;
};
