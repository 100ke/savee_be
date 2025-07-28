module.exports = (sequelize, DataTypes) => {
  const LedgerMember = sequelize.define(
    "LedgerMember",
    {},
    { tableName: "ledger_members" }
  );
  return LedgerMember;
};
