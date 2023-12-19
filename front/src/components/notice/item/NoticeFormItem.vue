<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { registArticle, detailArticle, modifyArticle } from "@/api/notice";
import { storeToRefs } from "pinia";
import { useMemberStore } from "@/stores/member";
import axios from "axios";

let token = sessionStorage.getItem("accessToken");
const memberStore = useMemberStore();
const { userName, userInfo } = storeToRefs(memberStore);
const router = useRouter();
const route = useRoute();

const props = defineProps({
  type: String,
  noticeId: String,
});
const userId = userInfo.value.id; // 실제 로그인 아이디로 변경해야함
const isUseId = ref(false);
const URL = "/server";
const article = ref({
  id: 0,
  title: "",
  content: "",
  writer_id: "",
  writer_email: "",
  writer_name: "",
  view_count: 0,
  creat_time: "",
});

onMounted(async () => {
  if (props.type === "modify") {
    const noticeId = route.params.noticeId;
    console.log(noticeId + "번글 얻어와서 수정할거야");
    console.log(userInfo.value);
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
  }
});

const subjectErrMsg = ref("");
const contentErrMsg = ref("");
watch(
  () => article.value.title,
  (value) => {
    let len = value.length;
    if (len == 0 || len > 30) {
      subjectErrMsg.value = "제목을 확인해 주세요!!!";
    } else {
      subjectErrMsg.value = "";
    }
  },
  { immediate: true }
);
watch(
  () => article.value.content,
  (value) => {
    let len = value.length;
    if (len == 0 || len > 500) {
      contentErrMsg.value = "내용을 확인해 주세요!!!";
    } else {
      contentErrMsg.value = "";
    }
  },
  { immediate: true }
);

const onSubmit = async () => {
  // event.preventDefault();

  if (subjectErrMsg.value) {
    alert(subjectErrMsg.value);
  } else if (contentErrMsg.value) {
    alert(contentErrMsg.value);
  } else {
    props.type === "regist" ? writeArticle() : updateArticle();
  }
};

const writeArticle = async () => {
  console.log("글등록하자!!", article.value);
  try {
    const response = await axios({
      method: "post",
      url: URL + "/notice/add",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": true,
        Authorization: "Bearer " + token,
      },
      data: {
        title: article.value.title,
        content: article.value.content,
      },
    });
    // console.log(registParam.value);
    console.log("Response: ", response.data);
    moveList();
  } catch (error) {
    console.error("Error:", error);
  }
};

const updateArticle = async () => {
  console.log(article.value.id + "번글 수정하자!!", article.value);
  try {
    const response = await axios({
      method: "put",
      url: URL + "/notice/edit",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": true,
        Authorization: "Bearer " + token,
      },
      data: {
        notice_id: route.params.noticeId,
        title: article.value.title,
        content: article.value.content,
      },
    });
    console.log("Response: ", response.data);
    moveList();
  } catch (error) {
    console.error("Error:", error);
  }
};

function moveList() {
  router.push({ name: "noticeList" });
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <!-- 글 헤드라인 -->
    <div class="row">
      <div class="col-12">
        <table>
          <tbody>
            <tr>
              <td>제목</td>
              <td class="text-left" style="text-align: left">
                <input
                  type="text"
                  class="form-control"
                  v-model="article.title"
                  style="width: 100%"
                />
              </td>
              <!-- <td>작성자: {{ userName }}</td> -->
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 작성자, 조회수, 수정하기, 삭제하기 버튼 -->
    <div class="row justify-content-end">
      <div class="col-auto">
        <table style="border: 0px; height: 10px">
          <tbody style="border: 0px; height: 10px">
            <tr style="border: 0px; height: 10px">
              <td style="text-align: left; border: 0px; height: 10px">작성자 : {{ userName }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 글 내용 Start -->
    <div class="row">
      <div class="col-12">
        <textarea
          class="form-control"
          rows="20"
          cols="10"
          v-model="article.content"
          style="resize: none; border: 1px solid black"
        ></textarea>
      </div>
    </div>
    <!-- 글 내용 End -->
    <br />
    <div class="row justify-content-center">
      <!-- Added row and justify-content-end classes for right alignment -->
      <!-- Modify Button Start -->
      <div class="col-auto">
        <!-- col-auto for automatic width -->
        <!-- <button class="modify-btn" @click="writeComplete">작성완료</button> -->
        <button type="submit" class="btn btn-outline-primary mb-3" v-if="props.type === 'regist'">
          글작성
        </button>
        <button type="submit" class="btn btn-outline-success mb-3" v-else>글수정</button>
      </div>
      <!-- Modify Button End -->
      <!-- View List Button Start -->
      <div class="col-auto">
        <button class="toList-btn" @click="moveList">목록보기</button>
      </div>
      <!-- View List Button End -->
    </div>
  </form>
</template>

<style scoped>
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
  font-size: 20px;
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
button {
  background-color: #132141;
  color: #fff;
  border: none;
  border-radius: 25px;
  padding: 0.375rem 0.75rem;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
}
button:hover {
  background-color: #FF8F00;
  color: #fff;
  border: none;
  border-radius: 25px;
  padding: 0.375rem 0.75rem;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
}
</style>
