const models = require("../models");
const ledgerMemberService = require("../services/ledgerMemberService");

// 멤버 생성은 이메일을 통해 초대 코드로 인증하므로 inviteController로 분리

// 멤버 목록 조회
const getMembers = async (req, res) => {};

// 멤버 상세 조회
const findMember = async (req, res) => {};

// 멤버 정보 수정
const updateMember = async (req, res) => {};

// 멤버 삭제
const deleteMember = async (req, res) => {};

module.exports = {
  addMembers,
  getMembers,
  findMember,
  updateMember,
  deleteMember,
};
