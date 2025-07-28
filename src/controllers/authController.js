const authService = require("../services/authService");

const signup = async (req, res) => {
  const { email, name, password } = req.body;
  try {
    const result = await authService.signup(email, name, password);
    res.status(201).json(result);
  } catch (error) {
    const status = error.status || 500;
    const message = error.message || "회원가입 중 오류 발생";
    res.status(status).json({ error: message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await authService.login(email, password);
    res.status(200).json(result);
  } catch (error) {
    const status = error.status || 500;
    const message = error.message || "로그인 중 오류가 발생했습니다.";
    res.status(status).json({ error: message });
  }
};

module.exports = {
  signup,
  login,
};
