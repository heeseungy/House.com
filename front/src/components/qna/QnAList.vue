<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getQnAList, addAnswer, deleteQuestion } from "@/api/qna";
import { useMemberStore } from '@/stores/member';
import { storeToRefs } from 'pinia';

import QPageNavigation from "@/components/common/QPageNavigation.vue";
import QnAListItem from "@/components/qna/item/QnAListItem.vue";

const router = useRouter();

const memberStore = useMemberStore();
const { isLogin } = storeToRefs(memberStore);


const { VITE_ARTICLE_LIST_SIZE } = import.meta.env;
const qna = ref([]); // 하단의 QnAListItem의 v-for 인자로 사용
const currentPage = ref(1); // 현재 페이지 번호
const startno = ref(0); // 시작 데이터 번호
// 한 페이지당 출력하고 싶은 게시글 조정 - 현재 3으로 되어있음
const totalPage = ref(0);
const param = ref({
  startIndex: startno.value, // 시작 데이터 번호
  count: VITE_ARTICLE_LIST_SIZE, // spp , 뽑는개수
});

onMounted(() => {
  qnaList(); // 서버에서 글목록 가져오기
});

// question list 불러오기
const qnaList = async () => {
  try {
    await getQnAList(param.value, (res) => {
      if (res.status === 200) {
        console.log(res.data.data_body.items);
        qna.value = res.data.data_body.items;
        startno.value = res.data.data_body.start_index;
        totalPage.value = res.data.data_body.total_count;
      }
    }, (error) => {
      console.log(error);
    });
  } catch (error) {
    console.error(error);
  }
};


// 페이지네이션 컴포넌트에서 사용
const onPageChange = (val) => {
  console.log(val + "번 페이지로 이동 준비");
  currentPage.value = val;
  param.value.startIndex = Math.max(0, (val-1)*param.value.count);
  qnaList();
};
// 1 0
// 2 5
// 3 10

const calculateAdjustedIndex = (index) => {
  const itemsPerPage = parseInt(VITE_ARTICLE_LIST_SIZE);
  const startIndex = totalPage.value - currentPage.value * itemsPerPage + 1;
  return startIndex - index;
};

// QnAListItem에서 작성하면 보내는 함수, 답변 등록 api 호출
const callAdd = async (id, comment) => {
  console.log(id, comment);
  try {
    await addAnswer({"id": id, answer: comment}, 
    (response)=>{
      if(response.status === 200){
        alert("답변 등록 완료!");
        // 재랜더링을 위해서 새로고침
        // router.go(0);
        qnaList();
      }
    }, (error)=> {
      console.log(error);
    })
  } catch (error){
    console.log(error);
  }
}
// QnAListItem에서 삭제요청하면 보내는 함수, 질문 삭제 api 호출
const callDelete = async (id) => {
  console.log(id);
  try{
    await deleteQuestion(
      id,
      (response) => {
        if(response.status === 200) {
          alert("질문 삭제 완료!");
          // 재랜더링을 위해서 새로고침
          // router.go(0);
          qnaList();
        }
      }, (error) => {
        console.log(error);
      }
    )
  } catch (error) {
    console.log(error);
  }
}

// 글작성 버튼을 누르면 실행될 함수
const moveAdd = () => {
  router.push({ name: "qnaRegist" });
};

</script>

<template>
  <!-- <div class="container"> -->
    <div class="row justify-content-center">
      <div class="col-lg-12">
        <div class="row align-self-center mb-2">
          <div class="col-md-2 text-start" v-if="isLogin">
            <button type="button" class="btn btn-custom btn-sm" @click="moveAdd">
              질문하기
            </button>
          </div>
        </div>
        <!-- QnA Start -->
        <QnAListItem v-for="(question, index) in qna" 
        :key="question.question_id" 
        :question="question"
        :index="calculateAdjustedIndex(index)"
        @addBtn="callAdd"
        @removeBtn="callDelete"
        ></QnAListItem>
        <!-- QnA End -->
      </div>
      <!-- 페이지네이션 Start-->
      <div class="m-4">
        <QPageNavigation 
        v-if="totalPage > 0"
        :current-page="currentPage" 
        :total-page="totalPage"
        @pageChange="onPageChange"
        ></QPageNavigation>
      </div>
      <!-- 페이지네이션 End -->
    </div>
  <!-- </div> -->


</template>

<style scoped>
.btn-custom{
  background: #132141;
  color: white;
  border-radius: 5px;
  font-size: 20px;
  font-weight: bold;
}
.btn-custom:hover{
  background: #FF8F00;
  font-weight: bold;
  color: #132141;
}
* {
  font-family: Orbit;
}
</style>
