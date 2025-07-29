const nodemailer = require("nodemailer");

const generateCode = () => {
  return Math.floor(Math.random() * 900000 + 100000).toString;
};

const sendMail = async (toEmail, code) => {
  const transpoter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "wesavee98s@gmail.com",
      pass: process.env.GOOGLE_APP_PASSWORD,
    },
  });
  (async () => {
    try {
      const info = await transpoter.sendMail({
        from: '"Savee Team" <wesavee98s@gmail.com>',
        to: toEmail,
        subject: "Savee 회원가입 이메일 인증 요청",
        html: `<div
      class="box"
      style="
        border-radius: 10px;
        border: 1px solid;
        width: 50%;
        margin: 0 auto;
        text-align: center;
        padding: 1rem 3rem;
      "
    >
      <h1 style="color: #422ef4;">SAVEE</h2>
      <h2 style="text-align: start; color: #333333;">이메일 인증번호</h4>
      <h3 style="text-align: start;">${toEmail} 계정으로 회원가입하는 데 필요한 인증 코드: </h3>
      <h1 style="background-color: #efefef; color: #5cb0ff; padding: 1rem">${code}</h1>
      <hr/>
      <p style="text-align: start;">이 이메일 계정으로 회원가입하려면 위 인증 코드(이)가 필요합니다. 회원가입을 원하시면 위 인증코드를 인증번호 입력 란에 입력해주시길 바랍니다. 인증코드의 만료 시간은 10분입니다.</p>
    </div>
    <p style="width: 60%; margin: 0 auto; padding: 1rem 0; color: #9a9a9a;">이 이메일은 자동 생성 및 전송되었습니다. 이 이메일에는 답장하지 마세요. 추가적인 도움이 필요하시면 Savee 고객지원에 문의하세요.</p>`,
      });
    } catch (error) {
      console.log("이메일 전송 중 오류가 발생했습니다.: ", error);
    }
  })();
};

module.exports = { generateCode, sendMail };
