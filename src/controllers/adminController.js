const adminService = require("../services/adminService");

const createUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { email, password, name, role } = req.body;
    const result = await adminService.createUser(
      email,
      name,
      password,
      role,
      userId
    );
    res.status(200).json(result);
  } catch (error) {
    const status = error.status || 500;
    const message = error.message || "사용자 생성 중 오류가 발생했습니다.";
    res.status(status).json({ error: message });
  }
};

module.exports = { createUser };
