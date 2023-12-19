import { localAxios } from "@/util/http-commons";

const local = localAxios();

// QnA 전체 리스트 조회
async function getQnAList(param, success, fail) {
  await local.get(`/question/findlist`, {params: param}).then(success).catch(fail);
}
// Question 상세 조회
async function detailQuestion(param, success, fail) {
  await local.get(`/question/find/`, param).then(success).catch(fail);
}

// Question 등록
async function registQuestion(param, success, fail) {
  await local.post(`/question/add`, param).then(success).catch(fail);
}

// Question 삭제
async function deleteQuestion(param, success, fail) {
  await local.delete(`/question/delete/`+param).then(success).catch(fail);
}

// Answer 등록
async function addAnswer(param, success, fail) {
  await local.put(`/question/answer`, param).then(success).catch(fail);
}
export { getQnAList, detailQuestion, registQuestion, deleteQuestion, addAnswer };