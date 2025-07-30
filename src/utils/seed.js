const { Category } = require("../models");

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
    { id: 9, name: "교통" },
    { id: 9, name: "이체" },
  ];

  for (const category of categories) {
    await Category.findOrCreate({
      where: { name: category.name },
    });
  }

  console.log("카테고리 시드 완료");
};

module.exports = { seedCategories };
