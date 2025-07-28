module.exports = (sequelize, DataTypes) => {
  const InviteCode = sequelize.define(
    "InviteCode",
    {
      // 코드를 생성한 사람
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ledger_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      code: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    { tableName: "invite_codes" }
  );

  InviteCode.associate = function (models) {
    InviteCode.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user_invitecodes",
    });

    InviteCode.belongsTo(models.Ledger, {
      foreignKey: "ledgerId",
      as: "ledger_invitecodes",
    });
  };
  return InviteCode;
};
