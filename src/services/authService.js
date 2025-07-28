const models = require("../models");
const bcrypt = require("bcrypt");
const { generateAccessToken } = require("../utils/token");

const signup = async (email, name, password, code) => {
  try {
    const hashedPw = await bcrypt.hash(password, 10);
    const user = await models.User.create({
      email: email,
      name: name,
      password: hashedPw,
      //   code: code,
    });
    // 이메일 인증로직 추가
    return {
      message: `${user.name}님 회원가입에 성공했습니다.`,
      user: { id: user.id, email },
    };
  } catch (error) {
    // error.status = 500;
    // throw error;
  }
};

const login = async (email, password) => {
  const user = await models.User.findOne({
    where: { email: email },
  });
  if (!user) {
    const error = new Error("등록된 사용자가 없습니다.");
    error.status = 401;
    throw error;
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("이메일 또는 비밀번호가 일치하지 않습니다.");
    error.status = 401;
    throw error;
  }

  const accessToken = generateAccessToken(user);
  return {
    message: `로그인 성공. ${user.name}님 환영합니다!`,
    accessToken: accessToken,
  };
};

module.exports = {
  signup,
  login,
};
