module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
    },
    { tableName: "users" }
  );
  User.associate = function (models) {
    User.hasMany(models.SupportPost, {
      foreignKey: "userId",
      as: "posts",
    });
  };
  return User;
};
