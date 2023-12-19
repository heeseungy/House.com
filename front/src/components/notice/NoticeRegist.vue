<script setup>
import router from "../../router";
import { storeToRefs } from "pinia";
import { useMemberStore } from "@/stores/member";
import NoticeFormItem from "./item/NoticeFormItem.vue";

const memberStore = useMemberStore();
const { userName } = storeToRefs(memberStore);
// const writeComplete = () => {
//   console.log("글 작성페이지에서 글 작성완료 버튼 클릭!!");
//   // 글 작성완료 로직 작성

//   router.push({ name: "noticeList" });
// };

// const list = () => {
//   console.log("글 작성페이지에서 목록보기 버튼 클릭!!");
//   alert("현재 페이지를 벗어나면 지금까지 작성한 모든 내용을 잃어버릴 수 있습니다.");
//   // 확인, 취소에 따라 분기 로직 작성

//   router.push({ name: "noticeList" });
// };
</script>

<template>
  <NoticeFormItem type="regist" />
</template>

<style scoped>
body {
  background-color: #f8f9fa;
}

.container {
  background-color: white;
  padding: 2rem;
  margin-top: 2rem;
  border-radius: 0.25rem;
}

h2 {
  margin-bottom: 1rem;
}

table {
  width: 100%;
  margin-bottom: 1rem;
}

table,
th,
td {
  border-top: 1px solid black;
  border-bottom: 1px solid black;
  border-collapse: collapse;
}

th,
td {
  padding: 0.5rem;
  text-align: center;
  vertical-align: middle;
}

th {
  background-color: #f8f9fa;
}

.content {
  padding: 1rem;
  margin-bottom: 1rem;
  white-space: pre-line;
}

.button-group a {
  text-decoration: none;
  color: black;
  margin-right: 1rem;
}

.button-group span {
  margin-right: 1rem;
}

button {
  background-color: #ffafcc;
  color: #fff;
  border: none;
  border-radius: 25px;
  padding: 0.375rem 0.75rem;
  font-weight: bold;
  cursor: pointer;
}

.text-right {
  text-align: right;
}
</style>
