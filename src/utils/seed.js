const { Category, User } = require("../models");
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

module.exports = { seedCategories, seedUsers };
