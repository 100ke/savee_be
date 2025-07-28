const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
  let token;
  if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res.status(401).json({ message: "토큰이 없습니다." });
  }
  // 토큰 검증
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
    }
    req.user = user;
    next();
  });
};

module.exports = {
  authenticate,
};
