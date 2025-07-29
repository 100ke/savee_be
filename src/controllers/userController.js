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

module.exports = { changePassword, changeName };
