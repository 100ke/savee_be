const models = require("../models");

// 개인 가게부 ledgerId 가져오기
const getPersonalLedger = async (userId) => {
  try {
    const { success, status, message } = await validateUserAndLedger(userId);
    if (!success) return { status, message };

    const ledger = await models.Ledger.findOne({
      where: { userId, is_shared: false },
    });

    if (!ledger) {
      return {
        status: 404,
        message: "개인 가계부가 없습니다. ",
      };
    }

    return {
      status: 200,
      message: "개인 가계부를 불러왔습니다.",
      data: ledger,
    };
  } catch (error) {
    throw error;
  }
};

const createLedger = async (name, is_shared, userId) => {
  try {
    const { success, status, message } = await validateUserAndLedger(userId);
    if (!success) return { status, message };

    // 개인 가계부는 무조건 하나만 만들 수 있도록 조건 추가
    const usersLedger = await models.Ledger.findByPk(userId);

    if (usersLedger) {
      if (!usersLedger.is_shared) {
        return {
          status: 404,
          message: "가게부가 이미 있습니다.",
        };
      }
    } else {
      const ledger = await models.Ledger.create({
        name: name,
        is_shared: is_shared,
        userId: userId,
      });

      // 공유 가계부 생성 시 해당 소유주를 owner로 멤버에 추가
      if (ledger.is_shared) {
        await models.LedgerMember.create({
          ledgerId: ledger.id,
          userId,
          role: "owner",
        });
      }
    }

    return { status: 200, message: "가계부가 만들어졌습니다.", data: ledger };
  } catch (error) {
    throw error;
  }
};

const updateLedger = async (userId, name, ledgerId) => {
  try {
    const { success, status, message } = await validateUserAndLedger(
      userId,
      ledgerId
    );
    if (!success) return { status, message };

    const ledger = await models.Ledger.findOne({
      where: { id: ledgerId },
    });

    // 가계부를 소유한 사용자가 맞는지 검증 후 수정
    if (ledger.userId == userId) {
      if (ledger) {
        if (name) ledger.name = name;
      }
    } else {
      return { status: 404, message: "가계부에 접근할 권한이 없습니다." };
    }

    await ledger.save();
    return {
      status: 200,
      message: "가계부 정보를 수정했습니다.",
      data: ledger,
    };
  } catch (error) {
    throw error;
  }
};

// 공유 가계부만 가져오기
const getLedgers = async (userId) => {
  try {
    const { success, status, message } = await validateUserAndLedger(userId);
    if (!success) return { status, message };

    const ledgers = await models.Ledger.findAll({
      where: { userId, is_share: true },
    });

    return {
      status: 200,
      message: "공유 가계부 목록을 가져왔습니다.",
      data: ledgers,
    };
  } catch (error) {
    throw error;
  }
};

// 공유 가계부만 삭제
const deleteLedger = async (userId, ledgerId) => {
  try {
    const { success, status, message } = await validateUserAndLedger(
      userId,
      ledgerId
    );
    if (!success) return { status, message };

    const ledger = await models.Ledger.findOne({
      where: { userId, id: ledgerId, is_shared: true },
    });

    if (ledger.userId == userId) {
      // 삭제하려는 가계부가 공유 가계부라면 멤버도 같이 삭제
      if (ledger.is_shared) {
        await models.LedgerMember.destroy({
          where: { ledgerId },
        });
      }
      await ledger.destroy();
    } else {
      return { status: 404, message: "가계부에 접근할 권한이 없습니다." };
    }

    return { status: 200, message: "가계부가 삭제되었습니다." };
  } catch (error) {
    throw error;
  }
};

const findLedger = async (userId, ledgerId) => {
  try {
    const { success, status, message } = await validateUserAndLedger(
      userId,
      ledgerId
    );
    if (!success) return { status, message };

    const ledger = await models.Ledger.findOne({
      where: { id: ledgerId },
    });

    if (ledger.userId == userId) {
      return { status: 200, message: "가계부를 가져왔습니다.", data: ledger };
    } else {
      return { status: 404, message: "가계부에 접근할 권한이 없습니다." };
    }
  } catch (error) {
    throw error;
  }
};

const validateUserAndLedger = async (userId, ledgerId) => {
  const user = await models.User.findByPk(userId);
  if (!user) {
    return {
      success: false,
      status: 404,
      message: "사용자 정보를 찾을 수 없습니다.",
    };
  }

  if (ledgerId !== null && ledgerId !== undefined) {
    const ledger = await models.Ledger.findOne({ where: { id: ledgerId } });

    if (!ledger) {
      return {
        success: false,
        status: 404,
        message: "가계부를 찾을 수 없습니다.",
      };
    }

    if (ledger.userId !== userId) {
      return {
        success: false,
        status: 404,
        message: "가계부에 접근할 권한이 없습니다.",
      };
    }
  }

  return { success: true, status: 200, user };
};

module.exports = {
  createLedger,
  updateLedger,
  getLedgers,
  deleteLedger,
  findLedger,
  getPersonalLedger,
};
