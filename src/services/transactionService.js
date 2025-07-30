const { Op } = require("sequelize");
const models = require("../models");

const addTransactions = async (
  userId,
  ledgerId,
  categoryId,
  type,
  amount,
  memo,
  date
) => {
  try {
    // 로그인한 사용자가 맞는지 검증
    const user = await models.User.findByPk(userId);

    if (!user) {
      return { message: "사용자 정보를 확인할 수 없습니다." };
    }

    // 가계부가 있는지 검증
    const ledger = await models.Ledger.findByPk(ledgerId);

    if (!ledger) {
      return { message: "해당 가계부를 찾을 수 없습니다." };
    }

    if (ledger.userId == userId && ledger.id == ledgerId) {
      const transac = await models.Transaction.create({
        type,
        amount,
        memo,
        categoryId,
        ledgerId,
        date,
      });

      return { message: "수입/지출 입력이 완료되었습니다.", data: transac };
    } else {
      return { message: "가계부에 접근할 권한이 없습니다." };
    }
  } catch (error) {
    throw error;
  }
};

const getTransactions = async (userId, ledgerId) => {
  try {
    const user = await models.User.findByPk(userId);

    if (!user) {
      return { message: "사용자 정보를 확인할 수 없습니다." };
    }

    const ledger = await models.Ledger.findByPk(ledgerId);

    if (!ledger) {
      return { message: "해당 가계부를 찾을 수 없습니다." };
    }

    if (ledger.userId == userId && ledger.id == ledgerId) {
      const transac = await models.Transaction.findAll({
        where: {
          ledgerId,
        },
      });

      return { message: "수입/지출 목록을 가져왔습니다.", data: transac };
    } else {
      return { message: "가계부에 접근할 권한이 없습니다." };
    }
  } catch (error) {
    throw error;
  }
};

const findTransaction = async (userId, ledgerId, transactionId) => {
  try {
    const user = await models.User.findByPk(userId);

    if (!user) {
      return { message: "사용자 정보를 확인할 수 없습니다." };
    }

    const ledger = await models.Ledger.findByPk(ledgerId);

    if (!ledger) {
      return { message: "해당 가계부를 찾을 수 없습니다." };
    }

    if (ledger.id == ledgerId && ledger.userId == userId) {
      const transac = await models.Transaction.findByPk(transactionId);

      if (!transac) {
        return { message: "해당 내역을 찾을 수 없습니다." };
      }

      return { message: "수입/지출 내역을 가져왔습니다.", data: transac };
    } else {
      return { message: "가계부에 접근할 권한이 없습니다." };
    }
  } catch (error) {
    throw error;
  }
};

const updateTransaction = async (
  userId,
  ledgerId,
  transactionId,
  categoryId,
  type,
  amount,
  memo
) => {
  try {
    const user = await models.User.findByPk(userId);

    if (!user) {
      return { message: "사용자 정보를 확인할 수 없습니다." };
    }

    const ledger = await models.Ledger.findByPk(ledgerId);

    if (!ledger) {
      return { message: "해당 가계부를 찾을 수 없습니다." };
    }

    if (ledger.id == ledgerId && ledger.userId == userId) {
      const transaction = await models.Transaction.findByPk(transactionId);

      if (transaction) {
        if (categoryId) transaction.categoryId = categoryId;
        if (type) transaction.type = type;
        if (amount) transaction.amount = amount;
        if (memo) transaction.memo = memo;
      }

      await transaction.save();
      return { message: "수입/지출 내역을 수정했습니다.", data: transaction };
    } else {
      return { message: "가계부에 접근할 권한이 없습니다." };
    }
  } catch (error) {
    throw error;
  }
};

const deleteTransaction = async (userId, ledgerId, transactionId) => {
  try {
    const user = await models.User.findByPk(userId);

    if (!user) {
      return { message: "사용자 정보를 확인할 수 없습니다." };
    }

    const ledger = await models.Ledger.findByPk(ledgerId);

    if (!ledger) {
      return { message: "해당 가계부를 찾을 수 없습니다." };
    }

    if (ledger.id == ledgerId && ledger.userId == userId) {
      await models.Transaction.destroy({ where: { id: transactionId } });

      return { message: "수입/지출 내역이 삭제되었습니다." };
    } else {
      return { message: "가계부에 접근할 권한이 없습니다." };
    }
  } catch (error) {
    throw error;
  }
};

const getMonthlyTransactions = async (userId, ledgerId, month) => {
  try {
    // 값을 입력하지 않았을 때 현재 월로 설정
    if (!month) {
      const now = new Date();
      const yyyy = now.getFullYear();
      // js에서 new Date(year, month, day) 생성자는 월을 0부터 시작
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      month = `${yyyy}-${mm}`;
    }

    const user = await models.User.findByPk(userId);

    if (!user) {
      return { message: "사용자 정보를 확인할 수 없습니다." };
    }

    const ledger = await models.Ledger.findByPk(ledgerId);

    if (!ledger) {
      return { message: "해당 가계부를 찾을 수 없습니다." };
    }

    if (!ledger || ledger.userId !== userId) {
      return { message: "가계부에 접근할 권한이 없습니다." };
    }

    const [year, mm] = month.split("-");
    const yearInt = parseInt(year, 10);
    const monthInt = parseInt(mm, 10);
    // monthInt는 다음달로 사용, 다음달의 0일은 전월의 마지막날
    // getDate() : 해당 날짜의 일(day)을 가져옴
    const lastDay = new Date(yearInt, monthInt, 0).getDate();
    const startDate = `${year}-${mm}-01`;
    const endDate = `${year}-${mm}-${String(lastDay).padStart(2, "0")}`;

    const transactions = await models.Transaction.findAll({
      where: {
        ledgerId,
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [
        ["date", "ASC"],
        ["createdAt", "ASC"],
      ],
    });

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((trs) => {
      if (trs.type === "income") totalIncome += trs.amount;
      if (trs.type === "expense") totalExpense += trs.amount;
    });

    return {
      message: `${month}의 거래 내역`,
      data: { transactions, summary: { totalIncome, totalExpense } },
    };
  } catch (error) {
    throw error;
  }
};

const getWeeklyTransactions = async (userId, ledgerId, month) => {
  try {
    // 값을 입력하지 않았을 때 현재 월로 설정
    if (!month) {
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      month = `${yyyy}-${mm}`;
    }

    const user = await models.User.findByPk(userId);

    if (!user) {
      return { message: "사용자 정보를 확인할 수 없습니다." };
    }

    const ledger = await models.Ledger.findByPk(ledgerId);

    if (!ledger) {
      return { message: "해당 가계부를 찾을 수 없습니다." };
    }

    if (!ledger || ledger.userId !== userId) {
      return { message: "가계부에 접근할 권한이 없습니다." };
    }

    // 마지막날 계산
    const [year, mm] = month.split("-");
    const yearInt = parseInt(year, 10);
    const monthInt = parseInt(mm, 10);
    const lastDay = new Date(yearInt, monthInt, 0).getDate();

    // 주차별로 반복하며 수입/지출 계산
    const weeks = [];

    // 한 달을 7일로 쪼개기 위해 7씩 증가 : 시작일은 1, 8, 15 ...
    for (let i = 1; i <= lastDay; i += 7) {
      const startDay = i;
      // 한 주의 종료일을 최대 lastDay로 제한, 마지막 주에서 오류 방지
      const endDay = Math.min(i + 6, lastDay);

      const startDate = `${year}-${mm}-${String(startDay).padStart(2, "0")}`;
      const endDate = `${year}-${mm}-${String(endDay).padStart(2, "0")}`;

      const transactions = await models.Transaction.findAll({
        where: {
          ledgerId,
          date: {
            [Op.between]: [startDate, endDate],
          },
        },
        order: [
          ["date", "ASC"],
          ["createdAt", "ASC"],
        ],
      });

      // 한 주의 수입/지출 합산
      const totalIncome = transactions
        .filter((trs) => trs.type === "income")
        .reduce((sum, trs) => sum + trs.amount, 0);
      const totalExpense = transactions
        .filter((trs) => trs.type === "expense")
        .reduce((sum, trs) => sum + trs.amount, 0);

      // 전주 대비 한 주의 수입/지출 증감 계산
      // 첫 주면 이전 주가 없으므로 0으로 설정
      const previousWeek = weeks[weeks.length - 1];
      const analysIncome = previousWeek ? totalIncome - previousWeek.income : 0;
      const analysExpense = previousWeek
        ? totalExpense - previousWeek.expense
        : 0;

      weeks.push({
        week: `${startDate} ~ ${endDate}`,
        income: totalIncome,
        expense: totalExpense,
        analysIncome: analysIncome,
        analysExpense: analysExpense,
        transactions,
      });
    }

    return { message: `${month} 주간 가계부`, data: weeks };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  addTransactions,
  getTransactions,
  findTransaction,
  updateTransaction,
  deleteTransaction,
  getMonthlyTransactions,
  getWeeklyTransactions,
};
