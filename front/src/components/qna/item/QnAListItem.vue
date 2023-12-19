<script setup>
import { ref } from 'vue';
import { useMemberStore } from '@/stores/member';
import { storeToRefs } from 'pinia';
const memberStore = useMemberStore();
const { isAdmin, userEmail } = storeToRefs(memberStore);

const props = defineProps({ question: Object, index: Number })
const emit = defineEmits(["addBtn"]);
// 질문 등록 => role: "DDUBEOKY"만 가능
// 질문 답변 => role: "admin"만 가능
// 질문 삭제 => 등록한 사용자 or admin만 가능
const comment = ref("");
const addBtn = () => {
  if(comment.value.length === 0){
    alert("답변을 입력해주세요!");
  } else {
    emit('addBtn', props.question.question_id, comment.value);
  }
}

// 답변 등록 api 호출
// const add = async () => {
//   try {
//     await addAnswer({"id": props.question.question_id, answer: comment.value}, 
//     (response)=>{
//       if(response.status === 200){
//         alert("답변 등록 완료!");
//         // 재랜더링을 위해서 새로고침
//         router.go(0);
//       }
//     }, (error)=> {
//       console.log(error);
//     })
//   } catch (error){
//     console.log(error);
//   }
// }

// 질문 삭제 버튼
// const removeBtn = async () => {
//   try{
//     await deleteQuestion(
//       props.question.question_id,
//       (response) => {
//         if(response.status === 200) {
//           alert("질문 삭제 완료!");
//           // 재랜더링을 위해서 새로고침
//           router.go(0);
//         }
//       }, (error) => {
//         console.log(error);
//       }
//     )
//   } catch (error) {
//     console.log(error);
//   }
// }

</script>

<template>
  <div>
    <div class="accordion accordion-flush mb-3 mt-3">
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
            :data-bs-target="'#'+question.question_id" aria-expanded="false" aria-controls="flush-collapseOne">
            <strong>#{{ index+4 }} {{ question.title }}</strong>
          </button>
        </h2>
        <div :id="question.question_id" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
          <!-- 작성 정보 시작 -->
          <div class="writerInfo">
            작성일: {{ question.question_create_time.split(' ')[0] }}
            작성자: {{ question.writer_name }}
          </div>
          <!-- 작성 정보 끝 -->
          <!-- 작성 내용 시작 -->
          <div class="accordion-body">
            {{ question.question }}
          </div>
          <!-- 작성 내용 끝 -->
          <div v-if="question.answer !== null">
            <hr style="width: 99%; margin: 0 auto;">
            <!-- 관리자 답변 시작 -->
            <div class="writerInfo" v-if="question.answer_create_time !== null">
              답변일: {{ question.answer_create_time.split(' ')[0] }}
            </div>
            <div class="ans">
              <strong>관리자: </strong>{{ question.answer }}
            </div>
            <!-- 관리자 답변 끝 -->
          </div>
          <!-- 관리자 답글 작성 폼 -->
          <div v-if="isAdmin && question.answer === null">
              <div class="input-group">
                <input type="text" class="form-control" placeholder="답변을 작성해주세요..." v-model="comment">
                <button class="btn btn-custom" type="button" @click="addBtn">작성</button>
                <!-- <button class="btn btn-custom" type="button" @click="addBtn">작성</button> -->
              </div>
          </div>
          <!-- 관리자 답글 작성 폼 끝 -->
          <!-- 질문 삭제 버튼 시작 -->
          <div class="text-center m-3" v-if="isAdmin || question.writer_email === userEmail">
              <button class="btn btn-outline-danger" type="button" @click="$emit('removeBtn', props.question.question_id)">삭제</button>
              <!-- <button class="btn btn-outline-danger" type="button" @click="removeBtn">삭제</button> -->
          </div>
          <!-- 질문 삭제 버튼 끝 -->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.accordion {
	--bs-accordion-btn-color: #132141;
	/* --bs-accordion-btn-bg: pink; */
	--bs-accordion-active-color: white;
	--bs-accordion-active-bg: #132141;
  border-radius: 15px;
}
.accordion-button:hover {
  background-color: #FF8F00;
  color: #132141;
}
.accordion-button:focus {
  z-index: 3;
  border-color: #FFF !important;
  outline: 0;
  box-shadow: 0 0 0 .25rem #FFF !important;
}
.writerInfo {
  float: inline-end;
  color: gray;
  margin: 2px;
  font-size: 12px;
}

.ans {
  margin: 10px 20px 10px 20px;
}

.btn-custom{
  background: #132141;
  color: white;
  border-radius: 5px;
}
.btn-custom:hover{
  background: #FF8F00;
  color: white;
}
.form-control{
  border-color: #132141;
}
* {
  font-family: Orbit;
  font-size: 18px;
}
</style>