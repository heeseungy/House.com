import { localAxios } from "@/util/http-commons";

const local = localAxios();


async function registArticle(article, success, fail) {
  console.log("noticejs article", article);
  await local.post(`/notice/add`, JSON.stringify(article)).then(success).catch(fail);
}

async function modifyArticle(article, success, fail) {
  await local.put(`/notice/edit`, JSON.stringify(article)).then(success).catch(fail);
}

async function deleteArticle(articleno, success, fail) {
  await local.delete(`/notice/delete/${articleno}`).then(success).catch(fail);
}

async function detailArticle(articleno, success, fail) { // getModifyNotice
  await local.get(`/notice/find/${articleno}`).then(success).catch(fail);
}

async function listArticle(param, success, fail) {
  await local.get(`/notice/findlist`, { params: param }).then(success).catch(fail);
  
  
}

export {
  registArticle,
  modifyArticle,
  deleteArticle,
  detailArticle,
  listArticle,
};
