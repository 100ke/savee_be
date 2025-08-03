require("dotenv").config();
const express = require("express");
const models = require("./models");

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const ledgerRouter = require("./routes/ledger");
const postRouter = require("./routes/support");
const transactionRouter = require("./routes/transaction");
const qnaRouter = require("./routes/qna");
const adminRouter = require("./routes/admin");
const inviteRouter = require("./routes/invite");
const ledgerMemberRouter = require("./routes/ledgerMember");
const budgetRouter = require("./routes/budget");

const { sequelize } = require("./models");
const { seedCategories, seedUsers } = require("./utils/seed");

const app = express();

// 미들웨어 설정
app.use(express.json());

// 서버 구동 테스트
app.get("/", (req, res) => {
  res.send("hello savee api");
});

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/ledgers", ledgerRouter);
app.use("/ledgers/:ledgerId/transactions", transactionRouter);
app.use("/support", postRouter);
app.use("/qna", qnaRouter);
app.use("/admin", adminRouter);
app.use("/invites", inviteRouter);
app.use("/ledgers/:ledgerId/members", ledgerMemberRouter);
app.use("/ledgers/:ledgerId/budgets", budgetRouter);

// 서버 실행
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`${PORT}번 포트에서 서버 실행 중`);

  models.sequelize
    .sync({ force: false })
    .then(() => {
      seedCategories();
      seedUsers();
      console.log(`db connect`);
    })
    .catch((err) => {
      console.log(`db error: ${err}`);
      process.exit();
    });
});
