const models = require("../models");
const bcrypt = require("bcrypt");

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await models.User.findByPk(userId);
  if (!user) {
    const error = new Error("사용자를 찾을 수 없습니다.");
    error.status = 404;
    throw error;
  }
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    const error = new Error("비밀번호가 일치하지 않습니다.");
    error.status = 401;
    throw error;
  }
  const hashedNewPw = await bcrypt.hash(newPassword, 10);
  user.password = hashedNewPw;
  await user.save();
  return { message: "비밀번호가 성공적으로 변경되었습니다." };
};

module.exports = { changePassword };
