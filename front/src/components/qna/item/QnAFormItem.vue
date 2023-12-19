<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { registQuestion } from "@/api/qna";

const router = useRouter();

const questions = ref({
  'title': "",
  'question': "",
});

// 입력값이 잘 들어왔는지 확인하기
const titleErrMsg = ref("");
const questionErrMsg = ref("");
watch(
  () => questions.value.title,
  (value) => {
    let len = value.length;
    if (len == 0 || len > 30) {
      titleErrMsg.value = "제목을 확인해 주세요!!!";
    } else {
      titleErrMsg.value = "";
    }
  },
  { immediate: true }
);
watch(
  () => questions.value.question,
  (value) => {
    let len = value.length;
    if (len == 0 || len > 500) {
      questionErrMsg.value = "내용을 확인해 주세요!!!";
    } else {
      questionErrMsg.value = "";
    }
  },
  { immediate: true }
);

const onSubmit = async () => {
  // event.preventDefault();
  if (titleErrMsg.value) {
    alert(titleErrMsg.value);
  } else if (questionErrMsg.value) {
    alert(questionErrMsg.value);
  } else {
    writeQuestion();
  }
};

const writeQuestion = async () => {
  console.log("질문 등록하자!!", questions.value);
  try {
    await registQuestion(
      questions.value, 
      (res)=> {
        if(res.status === 200) {
          console.log("질문 등록 성공~! 리스트로 이동합니다.");
          moveList();
        } else {
          console.log("질문 등록 실패..");
        }
    }, (error) => {
      console.log(error);
    })
  } catch (error) {
    console.error("Error:", error);
  }
};


function moveList() {
  router.push("/question");
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <div class="row">
      <div class="col-12">
        <div class="mb-3 row">
          <label for="inputTitle" class="col-sm-2 col-form-label" style="font-size: 20px; font-weight: bold;">제목</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" id="inputTitle" v-model="questions.title">
          </div>
        </div>
      </div>
    </div>

    <!-- 글 내용 Start -->
    <div class="row">
      <div class="col-12">
        <textarea
          class="form-control"
          rows="20"
          cols="10"
          v-model="questions.question"
          style="resize: none; border: 1px solid black"
        ></textarea>
      </div>
    </div>
    <!-- 글 내용 End -->
    <br />
    <div class="row justify-content-center">
      <div class="col-auto">
        <button type="submit" class="btn btn-custom-yellow mb-3">질문 등록</button>
      </div>
      <!-- View List Button Start -->
      <div class="col-auto">
        <button class="btn btn-custom mb-3" @click="moveList">목록보기</button>
      </div>
      <!-- View List Button End -->
    </div>
  </form>
</template>

<style scoped>
.btn {
  font-size: 20px;
  font-weight: bold;
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
}

.btn-custom-yellow{
  background-color: #FF8F00;
  color: #132141;
  border-radius: 5px;
  font-weight: bold;
}

.btn-custom-yellow:hover{
  background: #132141;
  color: white;
}
* {
  font-family: Orbit;
}
</style>
