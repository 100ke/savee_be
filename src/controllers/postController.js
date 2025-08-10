const models = require("../models");
const { Op } = require("sequelize");

//게시글 추가(only admin)
const createPost = async (req, res) => {
  const { title, content, post_type } = req.body;
  const supportPost = await models.SupportPost.create({
    title,
    content,
    post_type,
    userId: req.user.id,
  });
  res
    .status(201)
    .json({ message: "게시글이 등록되었습니다.", data: supportPost });
};

//게시글 전체 조회
const findAllPost = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10; // limit
  const offset = (page - 1) * pageSize;
  const keyword = req.query.keyword || "";

  const whereCondition = keyword
    ? { title: { [Op.like]: `%${keyword}%` } }
    : {};
  const totalPosts = await models.SupportPost.count({ where: whereCondition });
  const posts = await models.SupportPost.findAll({
    where: whereCondition,
    limit: pageSize,
    offset: offset,
    order: [["createdAt", "DESC"]],
  });
  const totalPages = Math.ceil(totalPosts / pageSize);
  res.status(200).json({
    message: "전체 게시글 목록을 조회 합니다.",
    data: {
      posts,
      pagination: {
        currentPage: page,
        pageSize,
        totalItems: totalPosts,
        totalPages,
      },
    },
  });
};
//게시글 id로 조회
const findPostById = async (req, res) => {
  const id = req.params.id;
  const post = await models.SupportPost.findByPk(id);
  if (post) {
    res.status(200).json({
      message: "게시글을 불러왔습니다.",
      data: post,
    });
  } else {
    res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
  }
};

//게시글 수정(only admin)
const updatePost = async (req, res) => {
  const { title, content, post_type } = req.body;
  const id = req.params.id;
  const post = await models.SupportPost.findByPk(id);
  if (post) {
    if (title) post.title = title;
    if (content) post.content = content;
    if (post_type) post.post_type = post_type;
    await post.save();
    res
      .status(200)
      .json({ message: "게시글 수정이 완료되었습니다.", data: post });
  } else {
    res.status(404).json({ message: "게시글이 없습니다." });
  }
};

//게시글 삭제(only admin)
const deletePost = async (req, res) => {
  const id = req.params.id;
  const result = await models.SupportPost.destroy({ where: { id: id } });
  if (result) {
    res.status(200).json({ message: "게시글이 삭제되었습니다." });
  } else {
    res.status(404).json({ message: "게시글이 없습니다." });
  }
};
module.exports = {
  createPost,
  findAllPost,
  findPostById,
  findPostByName,
  updatePost,
  deletePost,
};
