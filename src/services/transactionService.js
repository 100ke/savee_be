const models = require("../models");
const transaction = require("../models/transaction");

const addTransactions = async (
  userId,
  ledgerId,
  categoryId,
  type,
  amount,
  memo
) => {
  try {
    // 로그인한 사용자가 맞는지 검증
    const user = await models.User.findByPk(userId);

    if (!user) {
      return { message: "로그인이 필요합니다." };
    }

    // 가계부가 있는지 검증
    const ledger = await models.Ledger.findByPk(ledgerId);

    if (!ledger) {
      return { message: "가계부를 찾을 수 없습니다." };
    }

    if (ledger.userId == userId && ledger.id == ledgerId) {
      const transac = await models.Transaction.create({
        type,
        amount,
        memo,
        categoryId,
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
      return { message: "로그인이 필요합니다." };
    }

    const ledger = await models.Ledger.findByPk(ledgerId);

    if (!ledger) {
      return { message: "가계부를 찾을 수 없습니다." };
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
    const user = await models.User.findBypk(userId);

    if (!user) {
      return { message: "로그인이 필요합니다." };
    }

    const ledger = await models.Ledger.findByPk(ledgerId);

    if (!ledger) {
      return { message: "가계부를 찾을 수 없습니다." };
    }

    if (ledger.id == ledgerId && ledger.userId == userId) {
      const transac = await models.Transaction.findByPk(transactionId);

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
      return { message: "로그인이 필요합니다." };
    }

    const ledger = await models.Ledger.findByPk(ledgerid);

    if (!ledger) {
      return { message: "가계부를 찾을 수 없습니다." };
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
      return { message: "로그인이 필요합니다." };
    }

    const ledger = await models.Ledger.findByPk(ledgerid);

    if (!ledger) {
      return { message: "가계부를 찾을 수 없습니다." };
    }

    if (ledger.id == ledgerId && ledger.userId == userId) {
      await models.Transaction.destroy(transactionId);

      return { message: "수입/지출 내역이 삭제되었습니다." };
    } else {
      return { message: "가계부에 접근할 권한이 없습니다." };
    }
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
};
