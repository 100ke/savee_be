const { raw } = require("express");
const { chatGPT } = require("../utils/ai");
const {
  getCategoryExpensing,
  getWeeklyTotalExpensing,
  getMonthlyTotalExpensing,
  getLast7DaysExpensing,
  getLastMonthCategoryExpensing,
} = require("./statisticService");

const getSummary = async (userId, ledgerId) => {
  const type = "monthly";
  const groupedData = await getCategoryExpensing({ userId, ledgerId, type });
  const lastMonthGroupedData = await getLastMonthCategoryExpensing({
    userId,
    ledgerId,
  });
  const monthlyTrendData = await getMonthlyTotalExpensing(userId, ledgerId);
  const weeklyTrendData = await getWeeklyTotalExpensing(userId, ledgerId);
  const last7DaysData = await getLast7DaysExpensing(userId);

  const summaryPrompt = `
    사용자의 지출 데이터를 요약해줘. 지난 달 대비 이번 달의 소비 유형이 어떤지 설명해줘.
    - 이번 달 카테고리별 지출: ${JSON.stringify(groupedData)}
    - 지난 달 카테고리별 지출: ${JSON.stringify(lastMonthGroupedData)}
    - 월별 총 지출 추이: ${JSON.stringify(monthlyTrendData)}
    - 주별 총 지출 추이: ${JSON.stringify(weeklyTrendData)}
    - 최근 7일의 일일 지출: ${JSON.stringify(last7DaysData)}

    위 데이터를 통해 아래 사항을 설명해줘.
    1. 지난 달 대비 이번 달 어떤 카테고리의 지출이 유독 증가하거나 감소했는지
    2. 지난 달 대비 총 지출량의 증감량
    3. 사용자가 어떤 요일에 가장 소비가 많은지

    결과는 텍스트와 JSON 형식을 구분해서 반환하고, 다음과 같이 구조화하세요.
    설명 텍스트는 무조건 summaryText에만 넣어주고 아래와 같이 오직 JSON 객체만 출력하세요.
    숫자는 계산된 최종 값만 넣고, 불필요한 설명은 제외해.
    {
      "summaryText" : "string",
      "increasedCategories": [
        { "category": "string", "amountDifference": number }
      ],
      "decreasedCategories": [
        { "category": "string", "amountDifference": number }
      ],
      "totalChange": number,
      "maxSpendingDay": { "dayOfWeek": "string", "amount": number }
    }
  `;

  const result = await chatGPT(summaryPrompt);
  let parsedResult;
  try {
    parsedResult = JSON.parse(result);
  } catch (error) {
    console.error("JSON 파싱 실패: ", error);
    parsedResult = { error: "결과 파싱 실패", raw: result };
  }
  return { summary: parsedResult };
};

const getStrategy = async ({ summary }) => {
  if (!summary) {
    const error = new Error("소비 요약 데이터가 필요합니다.");
    error.status = 400;
    throw error;
  }
  const strategyPrompt = `
    다음은 우리 소비분석 가계부 사용자의 이번 달 소비 요약 입니다. :
    ${summary}

    위 소비 패턴을 분석하여 아래 사항을 제안해 주세요.
      1. 절약할 수 있는 구체적인 전략 3가지
      2. 주의가 필요한 소비 영역
      3. 긍정적인 소비 습관
      - 제안은 이해하기 쉽게 작성하고, 한국어로 작성해주세요.
      - 너무 추상적이지 않게 실제 생활에서 적용 가능한 팁을 제공해주세요.
  `;
  const result = await chatGPT(strategyPrompt);
  return { strategy: result };
};

module.exports = { getSummary, getStrategy };
