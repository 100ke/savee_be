const { ForeignKeyConstraintError } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const LedgerMember = sequelize.define(
    "LedgerMember",
    {
      ledger_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("owner", "member"),
        allowNull: false,
        defaultValue: "owner",
      },
    },
    { tableName: "ledger_members" }
  );

  LedgerMember.associate = function (models) {
    LedgerMember.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user_ledgermembers",
    });

    LedgerMember.belongsTo(models.Ledger, {
      foreignKey: "ledgerId",
      as: "ledger_ledgermembers",
    });
  };
  return LedgerMember;
};
