const models = require("../models");
const bcrypt = require("bcrypt");

const createUser = async (email, name, password, role, userId) => {
  const loginedUser = await models.User.findByPk(userId);
  if (loginedUser.role !== "admin") {
    const error = new Error("관리자만 접근 가능합니다.");
    error.status = 403;
    throw error;
  }
  const hashedPw = await bcrypt.hash(password, 10);
  const user = await models.User.create({
    email,
    name,
    password: hashedPw,
    role,
  });
  return {
    message: "회원 등록이 완료되었습니다.",
    userEmail: user.email,
    role: user.role,
  };
};

const viewUsersList = async (params) => {};

const updateUser = async (params) => {};

const deleteUser = async (params) => {};

module.exports = { createUser, viewUsersList, updateUser, deleteUser };
