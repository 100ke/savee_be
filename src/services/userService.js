const models = require("../models");
const bcrypt = require("bcrypt");
const {
  generateCode,
  sendMail,
  generateTempPw,
} = require("../utils/emailAuth");

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

const changeName = async (userId, name) => {
  const user = await models.User.findByPk(userId);
  if (!user) {
    const error = new Error("사용자를 찾을 수 없습니다.");
    error.status = 404;
    throw error;
  }
  user.name = name;
  await user.save();
  return { message: "이름을 변경하였습니다." };
};

// 비밀번호 찾기용 인증 메일 발송
const sendPasswordCode = async (name, email) => {
  // 회원 조회
  const user = await models.User.findOne({
    where: { name, email },
  });
  // 없다면 에러 반환
  if (!user) {
    const error = new Error("입력한 정보가 일치하지 않습니다.");
    error.status = 404;
    throw error;
  }
  // 새 인증번호 생성
  const code = generateCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10분 후
  const emailVerification = await models.EmailVerification.create({
    code,
    email,
    expiresAt,
  });
  // 메일 전송
  await sendMail({
    toEmail: email,
    type: "resetPassword",
    payload: { code, toEmail: email },
  });
  return {
    message: "이메일이 전송되었습니다.",
    expiresAt: emailVerification.expiresAt,
    email: emailVerification.email,
  };
};

const findPassword = async (name, email) => {
  // 1. 회원조회
  const user = await models.User.findOne({
    where: { name, email },
  });
  if (!user) {
    const error = new Error("입력한 정보가 일치하지 않습니다.");
    error.status = 404;
    throw error;
  }
  // 2. 인증번호 검증된 상태인지 확인
  const verifyInfo = await models.EmailVerification.findOne({
    where: { email: email },
    order: [["createdAt", "DESC"]],
  });
  if (!verifyInfo || !verifyInfo.isUsed) {
    const error = new Error("이메일 인증이 필요합니다.");
    error.status = 403;
    throw error;
  }
  // 3. 임시 비밀번호 생성
  const tempPassword = generateTempPw();
  const hashedNewPw = await bcrypt.hash(tempPassword, 10);
  // 4. 비밀번호 변경
  user.password = hashedNewPw;
  await user.save();
  return {
    message: "비밀번호가 임시 비밀번호로 재설정되었습니다.",
    tempPassword,
  };
};

const deleteUser = async (userId, enteredEmail, enteredPassword) => {
  const user = await models.User.findByPk(userId);
  if (!user) {
    const error = new Error("회원 정보를 찾을 수 없습니다.");
    error.status = 404;
    throw error;
  }
  if (user.email !== enteredEmail) {
    const error = new Error(
      "입력한 이메일이 현재 로그인된 계정과 일치하지 않습니다."
    );
    error.status = 403;
    throw error;
  }
  const isMatch = await bcrypt.compare(enteredPassword, user.password);
  if (!isMatch) {
    const error = new Error("비밀번호가 일치하지 않습니다.");
    error.status = 401;
    throw error;
  }
  await models.User.destroy({
    where: { id: userId },
  });
  return { message: "정상적으로 탈퇴되었습니다." };
};

module.exports = {
  changePassword,
  changeName,
  sendPasswordCode,
  findPassword,
  deleteUser,
};
