const userService = require("../services/userService");

const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const result = await userService.changePassword(
      userId,
      currentPassword,
      newPassword
    );
    res.status(200).json(result);
  } catch (error) {
    const status = error.status || 500;
    const message = error.message || "비밀번호 변경 중 오류가 발생했습니다.";
    res.status(status).json({ error: message });
  }
};

const changeName = async (req, res) => {
  try {
    const userId = req.user.id;
    const name = req.body.name;

    const result = await userService.changeName(userId, name);
    res.status(200).json(result);
  } catch (error) {
    const status = error.status || 500;
    const message = error.message || "이름 변경 중 오류가 발생했습니다.";
    res.status(status).json({ error: message });
  }
};

const sendPasswordResetEmail = async (req, res) => {
  try {
    const { name, email } = req.body;
    const result = await userService.sendPasswordCode(name, email);
    res.status(200).json(result);
  } catch (error) {
    const status = error.status || 500;
    const message = error.message || "이메일 발송 중 오류가 발생했습니다.";
    res.status(status).json({ error: message });
  }
};

const findPassword = async (req, res) => {
  try {
    const { name, email } = req.body;
    const result = await userService.findPassword(name, email);
    res.status(200).json(result);
  } catch (error) {
    const status = error.status || 500;
    const message = error.message || "비밀번호 재설정 중 오류가 발생했습니다.";
    res.status(status).json({ error: message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { email, password } = req.body;
    const result = await userService.deleteUser(userId, email, password);
    res.status(200).json(result);
  } catch (error) {
    const status = error.status || 500;
    const message = error.message || "회원 탈퇴 중 오류가 발생했습니다.";
    res.status(status).json({ error: message });
  }
};

module.exports = {
  changePassword,
  changeName,
  sendPasswordResetEmail,
  findPassword,
  deleteUser,
};
