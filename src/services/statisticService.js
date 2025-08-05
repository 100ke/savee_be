const models = require("../models");
const {
  getDateRange,
  getCurrentWeekInfo,
  getCurrentMonthInfo,
} = require("../utils/dateHelper");
const {
  filterByDateRange,
  groupByCategory,
  sumByCategory,
} = require("../utils/statHelper");
const { getTransactions } = require("./transactionService");

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
  // getTransactions 함수에 category 조인해야함
  // 통계 서비스에 새로운 함수 생성하여 사용 -> 기능 충돌 방지
  const response = await getTransactions(userId, ledgerId); // 고쳐야할 코드
  // getTransactions -> getTransactionsWithCategory 함수 사용할 것

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

// 트랜잭션(수입/지출) 조회 - 카테고리 조인
const getTransactionsWithCategory = async (userId, ledgerId) => {
  try {
  } catch (error) {}
};

module.exports = { getCategoryExpensing };
