const { Category, User, Ledger, Transaction } = require("../models");
const bcrypt = require("bcrypt");

//카테고리
const seedCategories = async () => {
  const categories = [
    { id: 1, name: "식비" },
    { id: 2, name: "취미" },
    { id: 3, name: "여가" },
    { id: 4, name: "병원" },
    { id: 5, name: "카페" },
    { id: 6, name: "교육" },
    { id: 7, name: "쇼핑" },
    { id: 8, name: "주거/통신" },
    { id: 9, name: "편의점" },
    { id: 10, name: "교통" },
    { id: 11, name: "이체" },
    { id: 12, name: "월급" },
    { id: 13, name: "용돈" },
    { id: 14, name: "기타 부수입" },
  ];

  for (const category of categories) {
    await Category.findOrCreate({
      where: { name: category.name },
    });
  }
  console.log("카테고리 시드 완료");
};

//user
const seedUsers = async () => {
  const users = [
    {
      id: 1,
      name: "user",
      email: "email@example.com",
      password: "1234",
      role: "user",
    },
    {
      id: 2,
      name: "admin",
      email: "admin@example.com",
      password: "1234",
      role: "admin",
    },
    {
      id: 3,
      name: "user2",
      email: "user2@example.com",
      password: "123456",
      role: "user",
    },
  ];

  for (const user of users) {
    //암호화
    const hashedPw = await bcrypt.hash(user.password, 10);
    await User.findOrCreate({
      where: { email: user.email }, // 중복 체크는 email로 충분
      defaults: {
        name: user.name,
        password: hashedPw,
        role: user.role,
      },
    });
  }

  console.log("유저 시드 완료");
};

const seedLedgerAndTransactions = async () => {
  try {
    // 1. 유저 찾기 (email 기준)
    const user = await User.findOne({ where: { email: "email@example.com" } });
    if (!user) {
      console.error("user not found");
      return;
    }

    // 2. 가계부 생성 (기존 존재하면 그대로 사용)
    const [ledger] = await Ledger.findOrCreate({
      where: {
        name: "user의 가계부",
        userId: user.id,
      },
      defaults: {
        is_shared: false,
      },
    });

    // 3. 카테고리 ID 가져오기
    const food = await Category.findOne({ where: { name: "식비" } });
    const transport = await Category.findOne({ where: { name: "교통" } });
    const cafe = await Category.findOne({ where: { name: "카페" } });
    const shopping = await Category.findOne({ where: { name: "쇼핑" } });
    const education = await Category.findOne({ where: { name: "교육" } });
    const hospital = await Category.findOne({ where: { name: "병원" } });

    if (!food || !transport || !cafe || !shopping || !education || !hospital) {
      console.error("카테고리가 존재하지 않습니다.");
      return;
    }

    // 4. 트랜잭션 시드 데이터
    const transactions = [
      {
        ledgerId: ledger.id,
        userId: user.id,
        type: "expense",
        categoryId: food.id,
        amount: 12000,
        memo: "점심 식사",
        date: "2025-08-05",
      },
      {
        ledgerId: ledger.id,
        userId: user.id,
        type: "expense",
        categoryId: transport.id,
        amount: 3000,
        memo: "버스비",
        date: "2025-08-06",
      },
      {
        ledgerId: ledger.id,
        userId: user.id,
        type: "expense",
        categoryId: cafe.id,
        amount: 4500,
        memo: "아메리카노",
        date: "2025-08-07",
      },
      {
        ledgerId: ledger.id,
        userId: user.id,
        type: "expense",
        categoryId: shopping.id,
        amount: 56000,
        memo: "의류 구매",
        date: "2025-08-10",
      },
      {
        ledgerId: ledger.id,
        userId: user.id,
        type: "expense",
        categoryId: education.id,
        amount: 80000,
        memo: "온라인 강의 수강",
        date: "2025-08-12",
      },
      {
        ledgerId: ledger.id,
        userId: user.id,
        type: "expense",
        categoryId: hospital.id,
        amount: 15000,
        memo: "병원 진료비",
        date: "2025-08-15",
      },
      {
        ledgerId: ledger.id,
        userId: user.id,
        type: "expense",
        categoryId: food.id,
        amount: 14000,
        memo: "저녁 식사",
        date: "2025-08-18",
      },
      {
        ledgerId: ledger.id,
        userId: user.id,
        type: "expense",
        categoryId: transport.id,
        amount: 3500,
        memo: "택시비",
        date: "2025-08-20",
      },
      {
        ledgerId: ledger.id,
        userId: user.id,
        type: "expense",
        categoryId: cafe.id,
        amount: 6000,
        memo: "카페 라떼",
        date: "2025-08-21",
      },
      {
        ledgerId: ledger.id,
        userId: user.id,
        type: "expense",
        categoryId: shopping.id,
        amount: 72000,
        memo: "전자제품 구매",
        date: "2025-08-25",
      },
      {
        ledgerId: ledger.id,
        userId: user.id,
        type: "income",
        categoryId: null, // 수입은 카테고리 없이 등록 (필요시 지정 가능)
        amount: 3000000,
        memo: "8월 월급",
        date: "2025-08-01",
      },
    ];

    await Transaction.bulkCreate(transactions);

    console.log("✅ user의 가계부 + 트랜잭션 시드 완료");
  } catch (error) {
    console.error("❌ 시드 함수 실행 중 에러 발생:", error);
  }
};

module.exports = { seedCategories, seedUsers, seedLedgerAndTransactions };
