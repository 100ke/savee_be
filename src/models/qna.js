const { ENUM } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Qna = sequelize.define(
    "Qna",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      question: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      answer: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      qna_type: {
        type: DataTypes.ENUM(
          "login",
          "ledger",
          "analysis",
          "error",
          "user",
          "etc"
        ),
        defaultValue: "login",
        allowNull: false,
      },
      iscompleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    },
    { tableName: "qna" }
  );
  return Qna;
};
