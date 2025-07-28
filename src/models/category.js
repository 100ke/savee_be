module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("income", "expense"),
        allowNull: false,
      },
      icon_url: {
        type: DataTypes.TEXT,
      },
    },
    { tableName: "categories" }
  );

  Category.associate = function (models) {
    Category.hasMany(models.Transaction, {
      foreignKey: "categoryId",
      as: "category_transactions",
    });
  };

  return Category;
};
