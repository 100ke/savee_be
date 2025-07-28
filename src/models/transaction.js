module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define(
    "Transaction",
    {},
    { tableName: "transaction" }
  );
  return Transaction;
};
