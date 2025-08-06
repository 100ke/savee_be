const models = require("../models");
const statisticService = require("../services/statisticService");

const getCategoryExpensing = async (req, res) => {
  try {
    const userId = req.user.id;
    const ledgerId = req.personalLedger.id;
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

const getMonthlyTotalExpensing = async (req, res) => {
  try {
    const userId = req.user.id;
    const ledgerId = req.personalLedger.id;
    const result = await statisticService.getMonthlyTotalExpensing(
      userId,
      ledgerId
    );
    res.status(200).json(result);
  } catch (error) {
    const status = error.status || 500;
    const message =
      error.message || "월간 지출 총합 조회 중 오류가 발생했습니다.";
    res.status(status).json({ error: message });
  }
};

const getWeeklyTotalExpensing = async (req, res) => {
  try {
    const userId = req.user.id;
    const ledgerId = req.personalLedger.id;
    const result = await statisticService.getWeeklyTotalExpensing(
      userId,
      ledgerId
    );
    res.status(200).json(result);
  } catch (error) {
    const status = error.status || 500;
    const message =
      error.message || "주간 지출 총합 조회 중 오류가 발생했습니다.";
    res.status(status).json({ error: message });
  }
};

module.exports = {
  getCategoryExpensing,
  getMonthlyTotalExpensing,
  getWeeklyTotalExpensing,
};
