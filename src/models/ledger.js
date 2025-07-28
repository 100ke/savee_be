module.exports = (sequelize, DataTypes) => {
  const Ledger = sequelize.define("Ledger", {}, { tableName: "ledgers" });
  return Ledger;
};
