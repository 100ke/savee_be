const models = require("../models");
const statisticService = require("../services/statisticService");

const getCategoryExpensing = async (req, res) => {
  try {
    const userId = req.user.id;
    const personalLedger = await models.Ledger.findOne({
      where: {
        userId,
        is_shared: false,
      },
    });
    if (!personalLedger) {
      return res.status(404).json({ message: "가계부를 조회할 수 없습니다." });
    }
    const ledgerId = personalLedger.id;
    const type = req.query.type;
    const result = await statisticService.getCategoryExpensing({
      userId,
      ledgerId,
      type,
    });
    res.status(200).json(result);
  } catch (error) {
    const status = error.status || 500;
    const message =
      error.message || "카테고리별 지출 조회 중 오류가 발생했습니다.";
    res.status(status).json({ error: message });
  }
};

module.exports = { getCategoryExpensing };
