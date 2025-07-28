module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      role: {
        type: DataTypes.ENUM("user", "admin"),
        defaultValue: "user",
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    { tableName: "users" }
  );
  User.associate = function (models) {
    User.hasMany(models.EmailVerification, {
      foreignKey: "userId",
    });
  };
  return User;
};
