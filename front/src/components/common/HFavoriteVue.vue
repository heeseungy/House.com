<script setup>
import {ref} from "vue";
// import axios from "axios";
import {useAddressStore} from "@/stores/addressStore";

import heartOn from "@/assets/Button_하트 on.png";
import heartOff from "@/assets/Button_하트 off.png";


const addressStore = useAddressStore();
const addressNames = addressStore.getAddressName();

const props = defineProps({
  aptList: Array,
  groupName: String,
  groupId: String,
});

// const heartButtonSrc = ref(heartOn);
const isModalClick = ref(false);
const selectedAptId = ref("");

// 최적 route를 구하는데 필요한 변수
const startPointCode = ref(null);
const endPointCode = ref(null);
const startPointName = ref(null);
const endPointName = ref(null);
// const resultList = ref([]);

function setInputTag(aptCode, aptName) {
  // if (startPointCode.value == null) {
  //   startPointCode.value = aptCode;
  //   startPointName.value = aptName;
  //   console.log("이거슨 스타트여 ", startPointCode.value);
  //   console.log("이거슨 스타트여 ", startPointName.value);
  // } else if (startPointCode.value == aptCode) {
  //   alert("출발지와 도착지가 동일할 수 없습니다.");
  //   return;
  // } else {
  //   endPointCode.value = aptCode;
  //   endPointName.value = aptName;
  //   console.log("이거슨 엔드여 ", endPointCode.value);
  //   console.log("이거슨 엔드여 ", endPointName.value);
  // }
}

function resetInputTag() {
  startPointCode.value = null;
  endPointCode.value = null;
  startPointName.value = null;
  endPointName.value = null;
}

function findRoute() {
  if (startPointCode.value == "" || endPointCode.value == "") {
    alert("값을 정확히 입력하세요.");
    return;
  }
}

const emit = defineEmits(["addGroup", "onHeartClick", "deleteGroup"]);

const addGroup = (aptId) => {
  isModalClick.value = true;
  selectedAptId.value = aptId;
  // "addGroup"이라는 이름으로 like_id와 isModalClick을 담아서 보냄
  emit("addGroup", {
    like_id: selectedAptId.value,
    isModalClick: isModalClick.value,
  });
};

const deleteGroup = (aptId) => {
  // axios({
  //   method: "delete",
  //   url: `${URL}/group/item/delete?likeId=${aptId}&groupId=${props.groupId}`,
  //   headers: {
  //     "Content-Type": "application/json",
  //     "ngrok-skip-browser-warning": true,
  //     Authorization: "Bearer " + token,
  //   },
  // })
  //   .then((res) => {
  //     alert("삭제되었습니다!");
  //     console.log(res.data);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  // location.reload();
  emit("deleteGroup", {aptId: aptId, groupId: props.groupId});
};

// 이미지 토글 함수
// 이미지 토글 함수
function toggleImage(apt) {
  apt.like_status = !apt.like_status;
  emit("onHeartClick", {aptId: apt.apt_id});
}
</script>

<template>
  <!-- <div id="findRoute" name="findRoute" class="findRoute" style="display: flex; flex-direction: row">
    <input placeholder="출발지" :value="startPointName" style="text-align: center; margin: 5px; width: 150px" />
    <input placeholder="도착지" :value="endPointName" style="text-align: center; margin: 5px; width: 150px" />
    <button @click="findRoute" type="submit" style="background-color: blue; color: white; font-weight: bold; margin: 5px">확인</button>
    <button @click="resetInputTag" style="background-color: red; color: white; font-weight: bold; margin: 5px">취소</button>
  </div> -->
  <!-- Component_06: 00개의 즐겨찾는 아파트 (list-count) Start -->
  <div name="list-count">
    <div style="text-align: center; font-weight: bold; font-family: Orbit; font-size: 25px; padding-bottom: 15px;">{{ aptList.length }}개의 즐겨찾는 아파트</div>
  </div>
  <!-- Component_06: 00개의 즐겨찾는 아파트 (list-count) End -->
  <div name="list-all">
    <!-- Component_07: 즐겨찾기 리스트 (list-all) Start -->
    <div v-for="apt in aptList" :key="apt.apt_id" :id="apt.apt_id" name="list-all" style="display: flex; flex-direction: column">
      <!-- 항목 1개 시작-->
      <div id="house-info" name="house-info" style="display: flex; border-top: 1px solid rgb(214, 214, 214)">
        <div name="info1">
          <img :src="`${apt.apt_img}`" style="width: 250px; height: 250px" />
        </div>
        <div style="width: 100%; padding-left: 40px; display: flex; flex-direction: row; justify-content: space-between;">
          <div name="info2n3" class="row" style="display: flex; flex-direction: row; justify-content: ;">
            <div @click="setInputTag(apt.apt_id, apt.apt_name)" name="info2" style="text-align: center; display: flex; align-items: end; padding-bottom: 5px; font-size: 30px; font-weight: bold">
              {{ apt.apt_name }}
            </div>
            <div name="info3" style="text-align: center; display: flex; font-size: 25px; color: gray; font-weight: bold">{{ addressNames.name1 }} {{ addressNames.name2 }} {{ apt.apt_road_name }} {{ apt.apt_road_name_bonbun }}</div>
          </div>
          <div name="info4">
            <a @click="toggleImage(apt)">
              <img id="heartButton" :src="apt.like_status ? heartOn : heartOff" alt="heart Button" style="width: 90px; height: 90px" />
            </a>
          </div>
        </div>
      </div>
      <!-- 항목 1개 끝-->
    </div>
    <!-- Component_07: 즐겨찾기 리스트 (list-all) End -->
    <hr>
    <div style="text-align: center; margin: 10px 0; font-size: 35px; font-weight: bold;">
      마지막 항목
    </div>
  </div>
</template>

<style scoped></style>
