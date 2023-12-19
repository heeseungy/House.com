<script setup>
import {ref, onMounted} from "vue";
import router from "@/router";
import {useRoute, useRouter} from "vue-router";
import {detailArticle, deleteArticle} from "@/api/notice";
import {useMemberStore} from "@/stores/member";
import {storeToRefs} from "pinia";
import axios from "axios";

const memberStore = useMemberStore();
const {isAdmin, userName} = storeToRefs(memberStore);
const route = useRoute();
const URL = "/server";

const props = defineProps({
  noticeId: String,
  idx: Number,
});

const article = ref({}); // 하단의 NoticeListItem의 v-for 인자로 사용
const noticeId = route.params.noticeId;
const index = route.params.idx;
onMounted(() => {
  getArticle(noticeId);
  console.log("게시글번호 :" + noticeId);
});

const getArticle = async (noticeId) => {
  try {
    const response = await axios({
      method: "get",
      url: URL + "/notice/find/" + noticeId,
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": true,
      },
    });
    article.value = response.data.data_body;
    console.log(article.value);
  } catch (error) {
    console.error(error);
  }
};

const modify = () => {
  console.log("글 수정하기로 이동");
  router.push({
    name: "noticeModify",
  });
};

const list = () => {
  console.log("글 목록으로 이동");
  router.push({name: "noticeList"});
};

const Delete = () => {
  console.log("글 삭제버튼 클릭 !!");
  deleteArticle(
    noticeId,
    (response) => {
      console.log(response);
      if (response.status == 200) moveList();
    },
    (error) => {
      console.log(error);
    }
  );
};

function moveList() {
  router.push({name: "noticeList"});
}
</script>

<template>
  <!-- 글 헤드라인 -->
  <div class="row">
    <div class="col-12">
      <table>
        <tbody>
          <tr style="font-size: 20px;">
            <td>{{ index }}</td>
            <td class="text-left" style="text-align: left; font-weight: bold;">{{ article.title }}</td>
            <td>{{ article.creat_time }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- 작성자, 조회수, 수정하기, 삭제하기 버튼 -->
  <div class="row justify-content-end">
    <div class="col-auto">
      <table style="border: 0px; font-size: 18px;">
        <tbody style="border: 0px">
          <tr style="border: 0px">
            <td style="text-align: left; border: 0px">작성자: {{ article.writer_name }}</td>
            <td class="text-left" style="text-align: left; border: 0px">
              <a v-if="userName === article.writer_name" @click="modify" class="abtn">📝 글 수정하기</a>
            </td>
          </tr>
          <tr style="border: 0px">
            <td style="text-align: left; border: 0px">조회수: {{ article.view_count }}</td>
            <td class="text-left" style="text-align: left; border: 0px">
              <a v-if="isAdmin || userName === article.writer_name" @click="Delete" class="abtn">🗑 글 삭제하기</a>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- <div id="one" class="mb-2">
                    <span>작성자: userId</span>
                    <a href="#">📝 글 수정하기</a>
                </div>
                        <div id="two">
                            <span>조회수: 124</span>
                            <a href="#">🗑 글 삭제하기</a>
                        </div> -->
    </div>
  </div>

  <!-- 글 내용 Start -->
  <div class="row" style="font-size: 18px;">
    <div class="col-12">
      <div class="content">
        {{ article.content }}
      </div>
    </div>
  </div>

  <!-- 글 내용 End -->

  <!-- 목록보기 버튼 Start -->
  <div style="display: flex; justify-content: center; margin-top: 0px; padding-bottom: 20px">
    <button class="toList-btn" @click="list">목록보기</button>
  </div>
  <!-- 목록보기 버튼 End -->
</template>

<style scoped>
body {
  background-color: #f8f9fa;
}
.abtn {
  text-decoration: none; 
  color: #132141; 
  font-weight: bold; 
  font-size: 18px;
}
.abtn:hover {
  color: #FF8F00; 
  font-weight: bold; 
  font-size: 18px;
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
  background-color: #132141;
  color: #fff;
  border: none;
  border-radius: 25px;
  padding: 0.375rem 0.75rem;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;
}
button:hover {
  background-color: #FF8F00;
  font-weight: bold;
  color: #132141;
}

.text-right {
  text-align: right;
}
</style>
