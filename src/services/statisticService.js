const models = require("../models");
const {
  getDateRange,
  getCurrentWeekInfo,
  getCurrentMonthInfo,
  getISOWeeksOfMonth,
  dayjs,
} = require("../utils/dateHelper");
const {
  filterByDateRange,
  groupByCategory,
  sumByCategory,
} = require("../utils/statHelper");
const { getTransactions } = require("./transactionService");

// 카테고리별 지출 통계
const getCategoryExpensing = async ({ userId, ledgerId, type }) => {
  // 1. 기준 기간 구하기 (주간/월간)
  let year, unitValue;
  if (type === "weekly") {
    const weekInfo = getCurrentWeekInfo();
    year = weekInfo.year;
    unitValue = weekInfo.week;
  } else if (type === "monthly") {
    const monthInfo = getCurrentMonthInfo();
    year = monthInfo.year;
    unitValue = monthInfo.month;
  } else {
    const error = new Error("타입은 'weekly' 또는 'monthly'만 가능합니다.");
    error.status = 400;
    throw error;
  }
  const { start, end } = getDateRange(type, year, unitValue);
  // 2. 기간 내에 포함되는 지출 데이터 필터링
  // getTransactions 함수에 category 조인해야함 (민아님 수정 예정)
  const response = await getTransactions(userId, ledgerId); // 고쳐야할 코드

  const data = response.data || [];
  const expenses = data.filter((item) => item.type === "expense");
  const filtered = filterByDateRange(expenses, start, end);
  // 3. 카테고리별로 그룹화
  const groupedData = await groupByCategory(filtered);

  // 4. 카테고리별 총합 계산
  const groupByTotal = await sumByCategory(groupedData);

  // 5. 포맷 정리 및 반환
  return groupByTotal;
  // 클라이언트에서 카테고리 이름, 금액 정렬, 퍼센트 등 추가 정보 필요하면 여기서 가공.
};

// 지출 추이 - 1. 총합 추이
// 1-1. 월간 총합 추이
const getMonthlyTotalExpensing = async (userId, ledgerId) => {
  const { year, month: currentMonth } = getCurrentMonthInfo();
  const monthlyTotal = [];
  // 수입 지출 목록 조회
  const response = await getTransactions(userId, ledgerId);
  const data = response.data || [];
  // 지출 항목 필터링
  const expenses = data.filter((item) => item.type === "expense");
  // 1. 올해의 1월부터 현재까지 반복
  for (let monthIndex = 1; monthIndex <= currentMonth; monthIndex++) {
    // 2. 월 단위 시작일과 종료일 계산
    const { start, end } = getDateRange("monthly", year, monthIndex);
    // 3. 각 월의 데이터 조회 + 총합 계산
    const filtered = filterByDateRange(expenses, start, end);
    // console.log({ start, end, filteredLength: filtered.length });
    let total = 0;
    filtered.forEach((element) => {
      total += element.amount;
    });
    monthlyTotal.push({ month: monthIndex, total });
  }
  return monthlyTotal;
};

// 1-2. 주간 총합 추이
const getWeeklyTotalExpensing = async (userId, ledgerId) => {
  const { year, month: currentMonth } = getCurrentMonthInfo();

  // 1. 지출 데이터 조회
  const response = await getTransactions(userId, ledgerId);
  const data = response.data || [];
  const expenses = data.filter((item) => item.type === "expense");
  // 2. 조회 기간 산출
  // 이번 달의 모든 iso 주차 번호
  const weeksInMonth = getISOWeeksOfMonth(year, currentMonth);
  // 지출 내역에 iso 주차 번호 부여
  const expensesWithWeek = expenses.map((expense) => {
    const week = dayjs(expense.date).isoWeek();
    return { ...expense, week };
  });

  // 3. 주차별 데이터 필터링
  const groupByWeek = expensesWithWeek.reduce((acc, curr) => {
    // acc: 누적값, curr: 현재 처리중인 expense
    const week = curr.week;
    if (!acc[week]) {
      acc[week] = [];
    }
    acc[week].push(curr);
    return acc;
  }, {});
  // 4. 주차별 총합 계산 -> 지출 내역 없는 주차는 total=0
  const weeklySum = weeksInMonth.map((week) => {
    const transactions = groupByWeek[week] || [];
    const total = transactions.reduce((sum, t) => sum + t.amount, 0);
    return {
      week,
      total,
    };
  });

  return weeklySum;
};

// 지출 추이 - 2. 최근 7일의 일일 추이

module.exports = {
  getCategoryExpensing,
  getMonthlyTotalExpensing,
  getWeeklyTotalExpensing,
};
