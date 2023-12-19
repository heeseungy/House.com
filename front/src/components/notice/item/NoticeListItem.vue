<script setup>
import {ref, defineProps, onMounted, computed} from "vue";
const {VITE_ARTICLE_LIST_SIZE} = import.meta.env;
const totalPage = ref(VITE_ARTICLE_LIST_SIZE);

const props = defineProps(["notice", "currentPage", "index"]);
const idx = computed(() => {
  return props.index - (props.currentPage - 1) * 5;
});
</script>

<template>
  <tr>
      <th class="text-start" scope="row">{{ idx }}</th>
      <td @click="detail" style="text-align: center">
        <router-link :to="{name: 'noticeDetail', params: {noticeId: notice.notice_id}}" class="notice-title link-dark">
        {{ notice.title }}
      </router-link>
      </td>
      <td class="text-end">{{ notice.time }}</td>
  </tr>

  <!-- <tr style="height: 70px; font-size: 16px; align-content: center">
    <td class="vertical-center">{{ idx }}</td>
    <td class="vertical-center col-lg-5" @click="detail" style="text-align: center">
      <router-link :to="{name: 'noticeDetail', params: {noticeId: notice.notice_id}}" class="notice-title link-dark">
        {{ notice.title }}
      </router-link>
    </td>
    <td class="vertical-center">{{ notice.time }}</td>
  </tr> -->
</template>

<style scoped>
a {
  text-decoration: none;
}
a:hover {
  color: white;
  background-color: #FF8F00;
  text-decoration: none;
}
table th,
table td {
  text-align: center;
  font-size: 18px;
  padding: 15px;
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
  margin-right: 0.5rem; /* 검색 버튼과의 간격 조정 */
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
</style>
