<script setup>
import { computed } from "vue";

const props = defineProps({ currentPage: Number, totalPage: Number });
const emit = defineEmits(["pageChange"]);

let total = props.totalPage;
const size = Math.floor(props.totalPage%5 > 0 ? (props.totalPage/5)+1 : props.totalPage/5);
let navigationSize = parseInt(import.meta.env.VITE_ARTICLE_NAVIGATION_SIZE);
if(size < navigationSize) {
  navigationSize = size;
}
total = size;

const startPage = computed(() => {
  return parseInt((props.currentPage - 1) / navigationSize) * navigationSize + 1;
});

const endPage = computed(() => {
  let lastPage =
    parseInt((props.currentPage - 1) / navigationSize) * navigationSize + navigationSize;
  return total < lastPage ? total : lastPage;
});

const endRange = computed(() => {
  return parseInt((total - 1) / navigationSize) * navigationSize < props.currentPage;
});

function range(start, end) {
  const list = [];
  for (let i = start; i <= end; i++) list.push(i);
  return list;
  //   return Array(end - start + 1)
  //     .fill()
  //     .map((val, i) => start + i);
}

function onPageChange(pg) {
  // => startIndex 받아오기
  console.log(pg + "로 이동!!!");
  emit("pageChange", pg);
}
</script>

<template>
  <div class="row">
    <div class="col-lg-12">
      <nav aria-label="Page navigation example" class="pagination-justified">
        <ul class="pagination">
          <li class="page-item">
            <a class="page-link" @click="onPageChange(startPage == 1 ? 1 : startPage - 1)">&lt;</a>
          </li>
          <template v-for="pg in range(startPage, endPage)" :key="pg">
            <li :class="currentPage === pg ? 'page-item active' : 'page-item'">
              <a class="page-link" @click="onPageChange(pg)">{{ pg }}</a>
            </li>
          </template>
          <li class="page-item">
            <a class="page-link" @click="onPageChange(endRange ? total : endPage + 1)">></a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<style scoped>
/* 페이지네이션을 가운데 정렬하기 위한 스타일 */
.pagination-justified {
  display: flex;
  justify-content: center;
}

.page-item.active .page-link {
  background-color: #132141;
  border-color: #132141;
  color: white;
}

.page-link:hover {
  background-color: #FF8F00;
  border-color: #FF8F00;
  color: white;
}

.page-link {
  color: gray;
}
a {
  cursor: pointer;
}

* {
  font-family: Orbit;
}
</style>
