module.exports = (sequelize, DataTypes) => {
  const Budget = sequelize.define("Budget", {}, { tableName: "budgets" });
  return Budget;
};
