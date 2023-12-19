<script setup>
import router from "../../router";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useMemberStore } from "@/stores/member";
import NoticeFormItem from "./item/NoticeFormItem.vue";

const route = useRoute();
const memberStore = useMemberStore();
const { userName } = storeToRefs(memberStore);

// const list = () => {
//   console.log("글 목록보기 버튼 클릭!!");
//   alert("현재 페이지에서 벗어나면 작성했던 내용을 잃어버릴 수 있습니다.");
//   router.push({ name: "noticeList" });
// };

// const modifyComplete = () => {
//   console.log("글 수정완료 버튼 클릭!!");
//   // 글 수정하는 로직 추가
//   router.push({ name: "noticeDetail" });
// };

// const Delete = () => {
//   console.log("글 삭제하기 버튼 클릭!!");
//   // 글 삭제하는 로직 추가
//   alert("정말 삭제하시겠습니까?");

//   router.push({ name: "noticeList" });
// };
</script>

<template>
  <NoticeFormItem type="modify" />
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
