const models = require("../models");

const createLedger = async (res, name, userId) => {
  try {
    // 로그인된 회원인지 확인
    const user = await models.User.findByPk({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "로그인이 필요합니다." });
    }

    const ledger = await models.Ledger.create({
      name: name,
      user_id: userId,
    });

    res.status(201).json({ message: "OK", data: ledger });
  } catch (error) {
    const status = error.status || 500;
    const message = error.message || "가계부를 만드는 중 문제가 발생했습니다.";
    res.status(status).json({ error: message });
  }
};
