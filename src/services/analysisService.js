const models = require("../models");
const {
  getCategoryExpensing,
  getWeeklyTotalExpensing,
  getMonthlyTotalExpensing,
  getLast7DaysExpensing,
} = require("./statisticService");

const getSummary = async (type, userId, ledgerId) => {
  const groupedData = await getCategoryExpensing({ userId, ledgerId, type });
  const trendData =
    type === "weekly"
      ? await getWeeklyTotalExpensing(userId, ledgerId)
      : await getMonthlyTotalExpensing(userId, ledgerId);
  const last7DaysData = await getLast7DaysExpensing(userId);

  const summaryPrompt = `
    사용자의 ${type} 지출 데이터를 요약해줘.
    - 카테고리별 지출: ${JSON.stringify(groupedData)}
    - 총 지출 추이: ${JSON.stringify(trendData)}
    - 최근 7일의 일일 지출: ${JSON.stringify(last7DaysData)}
  `;
};
