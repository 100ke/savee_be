const dayjs = require("dayjs");
const isoWeek = require("dayjs/plugin/isoWeek");

dayjs.extend(isoWeek);

// const now = dayjs(); // 현재 시간
// const today = now.format("YYYY-MM-DD"); // 오늘 날짜
const year = dayjs().year(); // 올해
const month = dayjs().month() + 1; // 이번 달 (월은 0부터 시작)
const week = dayjs().isoWeek(); // 올해에서 이번 주의 주차

const getCurrentMonthInfo = () => {
  return { year: year, month: month };
};

const getCurrentWeekInfo = () => {
  return { year: year, week: week };
};

const getDateRange = (type, year, monthOrWeek) => {
  switch (type) {
    case "weekly":
      const startOfWeek = dayjs()
        .year(year)
        .isoWeek(monthOrWeek)
        .startOf("isoWeek")
        .format("YYYY-MM-DD");
      const endOfWeek = dayjs()
        .year(year)
        .isoWeek(monthOrWeek)
        .endOf("isoWeek")
        .format("YYYY-MM-DD");
      return { start: startOfWeek, end: endOfWeek };

    case "monthly":
      const startOfMonth = dayjs(`${year}-${monthOrWeek}-01`)
        .startOf("month")
        .format("YYYY-MM-DD");
      const endOfMonth = dayjs(`${year}-${monthOrWeek}-01`)
        .endOf("month")
        .format("YYYY-MM-DD");
      return { start: startOfMonth, end: endOfMonth };
  }
};

// 월에 포함된 주차 리스트 추출
const getISOWeeksOfMonth = (year, month) => {
  const startOfMonth = dayjs(`${year}-${month}-01`);
  const endOfMonth = startOfMonth.endOf("month");

  const startWeek = startOfMonth.isoWeek();
  const endWeek = endOfMonth.isoWeek();

  let weeks = [];
  for (let w = startWeek; w <= endWeek; w++) {
    weeks.push(w);
  }
  return weeks;
};

module.exports = {
  dayjs,
  getCurrentMonthInfo,
  getCurrentWeekInfo,
  getDateRange,
  getISOWeeksOfMonth,
};
