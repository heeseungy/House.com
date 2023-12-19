<script setup>
import {ref, onMounted, computed, watch} from "vue";
import {useMemberStore} from "@/stores/member";
import {storeToRefs} from "pinia";
import router from "../../router";
import axios from "axios";

// api/notice.js 생성해서 http통신
// import { listArticle } from "@/api/notice.js";

import VPageNavigation from "@/components/common/VPageNavigation.vue";
import NoticeListItem from "@/components/notice/item/NoticeListItem.vue";

const memberStore = useMemberStore();
const {isAdmin} = storeToRefs(memberStore);
// const searchText = ref(""); // 검색어를 저장할 반응형 참조 생성, 제목 및 내용 검색
const URL = "/server";

const {VITE_ARTICLE_LIST_SIZE} = import.meta.env;
const notices = ref([]); // 하단의 NoticeListItem의 v-for 인자로 사용
const currentPage = ref(1);

const startno = ref(0);
// 한 페이지당 출력하고 싶은 게시글 조정
const totalPage = ref(0);
const totalCount = ref(0);

const param = ref({
  searchText: "", // 검색 word
  startIndex: startno.value, // pgno
  count: VITE_ARTICLE_LIST_SIZE, // spp , 뽑는개수
});

onMounted(() => {
  getNoticeList(); // 서버에서 글목록 가져오기
});

const getNoticeList = () => {
  axios({
    method: "get",
    url: URL + "/notice/findlist/?searchText=" + param.value.searchText + "&startIndex=" + param.value.startIndex + "&count=" + param.value.count,
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": true,
    },
  })
    .then((response) => {
      notices.value = response.data.data_body.items;
      startno.value = response.data.data_body.start_index;
      console.log(response);
      if (param.value.searchText != "") {
        totalPage.value = response.data.data_body.items.length;
        totalPage.value = Math.floor(totalPage.value % 5 > 0 ? totalPage.value / 5 + 1 : totalPage.value / 5);
        totalCount.value = response.data.data_body.items.length;
      } else {
        totalPage.value = response.data.data_body.total_count;
        totalCount.value = response.data.data_body.total_count;
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

// 페이지네이션 컴포넌트에서 사용
const onPageChange = (val) => {
  console.log(val + "번 페이지로 이동 준비");
  currentPage.value = val;
  // param.value.startIndex = 1 + VITE_ARTICLE_LIST_SIZE * (val - 1);
  param.value.startIndex = Math.max(0, (val - 1) * param.value.count);
  getNoticeList();
};
// 1 0
// 2 5
// 3 10
// 글작성 버튼을 누르면 실행될 함수
const moveWrite = () => {
  router.push({name: "noticeRegist"});
};
// // 검색 버튼 클릭 시 실행될 함수
// const search = () => {
//   console.log("검색 input에 입력한 내용 : " + searchText.value); // 콘솔에 입력된 검색어 출력
//   // 여기에 검색 로직을 추가하세요.
// };
</script>

<template>
  <!-- 검색창 start -->
  <div class="search-bar">
    <button v-if="isAdmin" class="write-btn" @click="moveWrite">글 작성</button>
    <button disabled v-else style="width: 0; height: 0; background-color: transparent"></button>
    <div class="search-group">
      <!-- <input type="text" class="form-control" placeholder="검색할 내용 입력" v-model="param.searchText" /> -->
      <!-- <button class="search-btn" @click="getNoticeList">검색</button> -->
      <div class="input-group">
          <input type="text" class="form-control" placeholder="검색할 내용 입력" v-model="param.searchText">
          <button class="btn btn-custom" type="button"  @click="getNoticeList">검색</button>
      </div>
    </div>
  </div>
  <!-- 검색창 End -->

  <!-- 게시글 리스트 Start -->

  <table class="table table-hover mt-4 mb-5">
    <thead>
      <tr>
        <th scope="col" class="text-start">번호</th>
        <th scope="col">제목</th>
        <th scope="col" class="text-end">등록일</th>
      </tr>
    </thead>
    <tbody>
      <!-- 향후 vue에서 v-for 적용 예정인 부분 -->
      <!-- key에서 받아오는 데이터 키값 확인해야함 notice_id -->
      <NoticeListItem v-for="(notice, index) in notices" :key="notice.notice_id" :notice="notice" :index="totalCount - index" :current-page="currentPage"></NoticeListItem>
    </tbody>
  </table>

  <!-- 게시글 리스트 End -->

  <!-- 페이지네이션 Start-->
  <VPageNavigation v-if="totalPage > 0" :currentPage="currentPage" :totalPage="totalPage" @pageChange="onPageChange"></VPageNavigation>

  <!-- 페이지네이션 End -->
</template>

<style scoped>
table th,
table td {
  text-align: center;
  font-size: 18px;
}

.vertical-center {
  vertical-align: middle;
}

/* 버튼 커스텀 스타일 */
button {
  background-color: #132141;
  color: #fff;
  border: none;
  border-radius: 25px;
  padding: 0.375rem 0.75rem;
  font-weight: bold;
  font-size: 18px;
}

button:hover {
  background-color: #FF8F00;
  font-weight: bold;
  color: #132141;
}

/* 테이블 스타일 조정 */
table {
  width: 100%;
  margin-top: 1rem;
}

.search-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

/* 검색창 그룹 스타일 */
.search-group {
  display: flex;
  align-items: center;
}

/* 입력란 스타일 */
.form-control {
  /* margin-right: 0.5rem; 검색 버튼과의 간격 조정 */
  flex-grow: 1; /* 입력란이 가능한 많은 공간을 차지하도록 */
}

/* 검색 버튼 스타일 */
.search-btn {
  /* 기존 스타일 유지 */
  white-space: nowrap; /* 버튼 내 텍스트가 줄바꿈되지 않도록 */
}

/* 글 작성 버튼 스타일 */
.write-btn {
  /* 필요한 스타일 추가 */
  margin-right: auto; /* 왼쪽에 정렬 */
}

.btn-custom{
  background: #132141;
  color: white;
  border-radius: 5px;
  font-weight: bold;
}
.btn-custom:hover{
  background: #FF8F00;
  color: #132141;
  font-weight: bold;
}
.form-control{
  border-color: #132141;
}
</style>
