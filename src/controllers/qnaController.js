const models = require("../models");
const { Op } = require("sequelize");

//질문 추가
const createQna = async (req, res) => {
  const { title, question, qna_type } = req.body;
  if (!title || title.trim() == "" || !question || question.trim() == "") {
    return res.status(400).json({ message: "빈 값은 등록 할 수 없습니다." });
  }
  const qna = await models.Qna.create({
    title,
    question,
    qna_type,
    userId: req.user.id,
  });
  return res.status(201).json({ message: "질문이 등록되었습니다.", data: qna });
};

//질문 전체 조회
const findAllQna = async (req, res) => {
  const qnas = await models.Qna.findAll();
  return res
    .status(200)
    .json({ message: "전체 질문 목록을 조회 합니다.", data: qnas });
};

//질문 수정(only 작성자)
const updateQna = async (req, res) => {
  const { title, question, qna_type } = req.body;
  const id = req.params.id;
  const qna = await models.Qna.findByPk(id);
  const userId = req.user.id;
  // 작성자 본인인지 확인
  if (qna.userId !== userId) {
    return res.status(403).json({ message: "작성자만 수정할 수 있습니다." });
  }
  if (qna) {
    if (title) qna.title = title;
    if (question) qna.question = question;
    if (qna_type) qna.qna_type = qna_type;
    await qna.save();
    return res
      .status(200)
      .json({ message: "질문 수정이 완료되었습니다.", data: qna });
  } else {
    return res.status(404).json({ message: "질문이 없습니다." });
  }
};

//질문 제목 조회
const findQnaByName = async (req, res) => {
  const title = req.query.title;
  const qnas = await models.Qna.findAll({
    where: {
      title: {
        [Op.iLike]: `%${title}%`, //대소문자 무시
      },
    },
  });
  if (!qnas || qnas.length === 0) {
    return res.status(200).json({ message: "검색 결과가 없습니다.", data: [] });
  }
  return res.status(404).json({ message: "질문이 없습니다.", error });
};

//질문 삭제(only 작성자, admin)
const deleteQna = async (req, res) => {
  const id = req.params.id;
  const qna = await models.Qna.findByPk(id);
  if (req.user.role != "admin") {
    if (qna.userId != id) {
      return res.status(403).json({ message: "삭제 권한이 없습니다." });
    }
  }
  const result = await models.Qna.destroy({ where: { id: id } });

  if (result) {
    return res.status(200).json({ message: "질문이 삭제되었습니다." });
  } else {
    return res.status(404).json({ message: "질문이 없습니다." });
  }
};

//답변 등록
const addAnswer = async (req, res) => {
  const { answer } = req.body;
  const id = req.params.id;
  const qna = await models.Qna.findByPk(id);

  if (qna) {
    if (qna.iscompleted == true) {
      return res
        .status(400)
        .json({ message: "이미 답변이 등록 된 질문입니다." });
    }
    if (!answer || answer.trim() == "") {
      res.status(400).json({ message: "빈 답변은 등록 할 수 없습니다." });
    } else {
      qna.answer = answer;
      qna.iscompleted = true;
    }
    await qna.save();
    return res
      .status(200)
      .json({ message: "답변이 등록되었습니다.", data: qna });
  } else {
    return res.status(404).json({ message: "질문이 없습니다." });
  }
};
//답변 취소
const deleteAnswer = async (req, res) => {
  const { answer } = req.body;
  const id = req.params.id;
  const qna = await models.Qna.findByPk(id);

  if (qna) {
    if (qna.iscompleted != true || !qna.answer) {
      return res.status(400).json({ message: "등록된 답변이 없습니다." });
    }
    qna.iscompleted = false;
    await qna.save();
    return res
      .status(200)
      .json({ message: "답변이 삭제되었습니다.", data: qna });
  } else {
    return res.status(404).json({ message: "질문이 없습니다." });
  }
};
//답변 수정
const updateAnswer = async (req, res) => {
  const { answer } = req.body;
  const id = req.params.id;
  const qna = await models.Qna.findByPk(id);

  if (qna) {
    if (qna.iscompleted != true || !qna.answer) {
      return res.status(400).json({ message: "등록된 답변이 없습니다." });
    }
    if (!answer || answer.trim() == "") {
      res.status(400).json({ message: "빈 답변은 등록 할 수 없습니다." });
    } else {
      qna.answer = answer;
    }
    await qna.save();
    return res
      .status(200)
      .json({ message: "답변을 수정하였습니다.", data: qna });
  } else {
    return res.status(404).json({ message: "질문이 없습니다." });
  }
};
module.exports = {
  createQna,
  findAllQna,
  findQnaByName,
  updateQna,
  deleteQna,
  addAnswer,
  updateAnswer,
  deleteAnswer,
};
