const models = require("../models");

// 임시 사용자 생성
const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await models.User.create({
      name,
      email,
      password,
    });

    res.status(201).json({ message: "OK", data: user });
  } catch (error) {
    const status = error.status || 500;
    const message = error.message || "회원가입을 하지 못했습니다.";
    res.status(status).json({ error: message });
  }
};

// 가계부 자체 생성
const createLedger = async (req, res) => {
  const { name, userId } = req.body;

  try {
  } catch (error) {
    const status = error.status || 500;
    const message = error.message || "가계부를 만들지 못했습니다.";
    res.status(status).json({ error: message });
  }
};

module.exports = {
  createUser,
  createLedger,
};
