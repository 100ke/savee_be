module.exports = (sequelize, DataTypes) => {
  const Budget = sequelize.define(
    "Budget",
    {
      year: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      month: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      limit_amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { tableName: "budgets" }
  );

  Budget.assoicate = function (models) {
    Budget.belongsTo(models.Ledger, {
      foreignKey: "ledgerId",
      as: "ledger_budgets",
    });

    Budget.belongsTo(models.Category, {
      foreignKey: "ledgerId",
      as: "ledger_budgets",
    });
  };

  return Budget;
};
