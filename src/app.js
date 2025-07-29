require("dotenv").config();
const express = require("express");
const models = require("./models");

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const ledgerRouter = require("./routes/ledger");
const postRouter = require("./routes/support");

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
app.use("/support", postRouter);

// 서버 실행
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`${PORT}번 포트에서 서버 실행 중`);

  models.sequelize
    .sync({ force: false })
    .then(() => {
      console.log(`db connect`);
    })
    .catch((err) => {
      console.log(`db error: ${err}`);
      process.exit();
    });
});
