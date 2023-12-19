// 회원 api 호출 처리 파일
import { localAxios } from "@/util/http-commons";
const local = localAxios();

// 사용자 로그인 확인
async function userConfirm(param, success, fail) {
  await local.post(`/user/login`, param).then(success).catch(fail);
  // await axios.post(`/server/user/login`, param);
}

// 사용자 네이버 로그인
async function naverAuth(success, fail) {
  await local.get(`/oauth2/authorization/naver`, {
      // withCredentials: true,
      // headers: {
      //   "cors-proxy-url": "https://nid.naver.com/", // 이 부분을 이용하는 서버 URL로 변경
      //   "Access-Control-Allow-Origin": "*",
      // },
    })
    .then(success)
    .catch(fail);
}

// 사용자 회원가입
async function userSingUp(param, success, fail) {
  await local.post(`/user/add`, param).then(success).catch(fail);
}

// 사용자 정보반환
async function findByUser(success, fail) {
  await local
    .get(`/user/find`)
    .then(success)
    .catch(fail);
}

// 사용자 정보 수정
async function userUpdate(param, success, fail) {
  await local
    .put(`/user/edit`, param)
    .then(success)
    .catch(fail);
}

// 사용자 회원탈퇴
async function userDelete(success, fail) {
  await local
    .delete(`/user/delete`)
    .then(success)
    .catch(fail);
}
export {
  userConfirm,
  naverAuth,
  userSingUp,
  findByUser,
  userUpdate,
  userDelete,
};
