<script setup>
import {
  ref,
  onMounted,
  onUnmounted,
  watch,
  defineProps,
  defineEmits,
} from "vue";
import { useAddressStore } from "@/stores/addressStore";

import heartOn from "@/assets/Button_하트 on.png";
import heartOff from "@/assets/Button_하트 off.png";
import axios from "axios";

const URL = "/server";
let token = sessionStorage.getItem("accessToken");

const addressStore = useAddressStore();
const addressNames = addressStore.getAddressName();
console.log(addressNames.name1);
console.log(addressNames.name2);
console.log(addressNames.name3);

const rightSideDetailHeight = ref(0);

// const heartButtonSrc = ref(heartOn);

const emit = defineEmits(["clickHouseInfo", "showDetail"]);

// house-info div 클릭 이벤트를 위한 메소드
const clickHouseInfo = (aptId) => {
  console.log("HListVue : ", aptId);
  // HouseContents.vue에 이벤트를 발생시킴
  emit("clickHouseInfo", aptId);
};

// props 값 받기
const props = defineProps({
  // 아파트리스트
  aptList: Array,
});

// watch를 통해 pinia의 변화를 직접 감지.
watch(
  () => addressStore.selectedAddressName,
  (newNames) => {
    console.log(addressStore.getAddressName());

    console.log(addressNames.name1);
    console.log(addressNames.name2);
    console.log(addressNames.name3);
    // 스토어의 selectedAddressName이 바뀔 때마다 로컬 참조를 업데이트
    addressNames.name1 = newNames.name1;
    addressNames.name2 = newNames.name2;
    addressNames.name3 = newNames.name3;
  },
  { deep: true }
); // 스토어 상태는 반응형이므로 deep 옵션을 사용하여 중첩된 객체의 변화도 감지

// 이미지 토글 함수
function toggleImage(apt) {
  // 원래 관심 목록에 등록 된거면 like_status false로 바꾸고, 서버에 반영, aptList 다시 불러오기
  if (apt.like_status) {
    apt.like_status = !apt.like_status;
    axios({
      method: "delete",
      url: URL + "/like/delete/" + apt.apt_id,
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  // 원래 관심 목록에 등록되지 않았던거면 like_status true로 바꾸고, 서버에 반영, aptList 다시 불러오기
  else if (!apt.like_status) {
    apt.like_status = !apt.like_status;
    axios({
      method: "post",
      url: URL + "/like/add/" + apt.apt_id,
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  //   location.reload();
}

// 높이 조절 함수
function adjustRightColumnHeight() {
  const div1Height = document.getElementById("div1").clientHeight;
  const rightSideTitleHeight =
    document.getElementById("right-side-title").clientHeight;
  rightSideDetailHeight.value = div1Height - rightSideTitleHeight;
}

onMounted(() => {
  // 컴포넌트가 마운트될 때 높이 조절
  adjustRightColumnHeight();
  window.addEventListener("resize", adjustRightColumnHeight);
});

onUnmounted(() => {
  // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
  window.removeEventListener("resize", adjustRightColumnHeight);
});

// 반응형 창 크기 조절에 대응
watch(() => rightSideDetailHeight.value, adjustRightColumnHeight);
</script>

<template>
  <!-- Category_02: right-side-title (col-lg-3) Start -->
  <div id="right-side-title" name="right-side-title">

    <div
      style="
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding-top: 15px;
      "
    >
      <div style="align-items: center">
        <div class="aptN-name" style="font-weight: bold; font-size: 30px; font-family: Orbit;">
          {{ addressNames.name3 }}, {{ addressNames.name2 }}
        </div>
      </div>
    </div>

    <br />

  </div>
  <!-- Category_02: right-side-title (col-lg-3) End -->

  <br />

  <!-- Category_03: right-side-detail (col-lg-3) Start -->
  <div
    id="right-side-detail"
    name="right-side-detail"
    style="height: 1200px;
    justify-content: space-between;"
  >
    <!-- Component_06: 00개의 검색결과(list-count) Start -->
    <div style="text-align: center; font-weight: bold; font-family: Orbit; font-size: 23px; padding-bottom: 15px;">
      {{ props.aptList.length }}개의 검색결과
    </div>
    <!-- Component_06: 00개의 검색결과(list-count) End -->
    <!-- Component_07: 집 리스트(list-all) Start -->
    <div
      v-for="apt in aptList"
      :key="apt.apt_id"
      :id="apt.apt_id"
      name="list-all"
      style="display: flex; flex-direction: column;"
    >
      <!-- 항목 1개 시작-->
      <div
        id="house-info"
        name="house-info"
        style="
          display: flex;
          border-top: 2px solid rgb(214, 214, 214);

        "
      >
        <div name="info1" style=" height: 100%;  width: 18%;">
          <img :src="`${apt.apt_img}`" style="width: 200px; height: 200px; object-fit: cover;"/>
        </div>
        
        <div style="display:flex; width: 100%; justify-content:space-between; padding-left:30px" >
        <div
          @click="clickHouseInfo(apt.apt_id)"
          name="info2n3"
          class="row"
          style="
          display: flex;
          flex-direction: column;
          justify-content: center;"  
        >
          <div
            name="info2"
            style="
              text-align: left;
              display: flex;
              align-items: left;
              padding-bottom: 5px;
              font-size: 35px;
              font-weight: bold;
              font-family: Orbit;
            "
          >
            {{ apt.apt_name }}
          </div>
          <div
            name="info3"
            style="
              text-align: center;
              display: flex;
              font-size: 25px;
              color: gray;
              font-weight: bold;
              text-align: left;
              font-family: Orbit;
              width: 100%;
            "
          >
            {{ addressNames.name1 }} {{ addressNames.name2 }}
            {{ addressNames.name3 }} {{ apt.apt_road_name }}
          </div>
        </div>
        <div name="info4" style="width: 10%; display: flex; align-items: center;">
          <a @click="toggleImage(apt)">
            <img
              id="heartButton"
              :src="apt.like_status ? heartOn : heartOff"
              alt="heart Button"
              style="width: 90px; height: 90px;"
            />
          </a>
        </div>
      </div>
      </div>
      <!-- 항목 1개 끝-->
    </div>
    <hr>
    <div style="text-align: center; margin: 10px 0; font-size: 35px; font-weight: bold;">
      마지막 항목
    </div>
    <!-- Component_07: 집리스트(list-all) End -->
  </div>
  <!-- Category_03: right-side-detail (col-lg-3) End-->
</template>

<style scoped>
.map-div {
  /* border-radius: 15px; */
  border: 1px solid black;
  border-collapse: collapse;
  width: auto;
  height: 800px;
}

.btn-custom {
  background-color: #cc1245;
  color: #fff;
  border-radius: 25px;
  white-space: nowrap;
  min-width: 70px;
  font-weight: bold;
}

.custom-row {
  display: flex;
  /* border-top: 1px solid black; */
}

.element {
  /* border-right: 1px solid black; */
  padding: 10px;
  flex-grow: 1;
  text-align: left;
}

th,
td {
  padding: 10px;
  width: 20%;
}

/* 오른쪽 사이드바 스타일 */
#right-side-title {
  overflow-y: hidden;
  /* 세로 스크롤 활성화 */
  overflow-x: hidden;
  /* 가로 스크롤 비활성화 */
}

#right-side-detail {
  overflow-y: auto;
  /* 세로 스크롤 활성화 */
  overflow-x: hidden;
  /* 가로 스크롤 비활성화 */
  height: 100px;
  /* 높이 */
}

::-webkit-scrollbar {
  display: none;
}


.loadMore-btn {
  padding: 0.5em 1em;
  /* 패딩을 적절히 조정 */
  background-color: #FF8F00;
  color: white;
  border-radius: 25px;
  white-space: nowrap;
  /* 필요에 따라 normal로 변경 */
  font-weight: bold;
  overflow: hidden;
  /* 필요에 따라 추가 */
  min-width: 100px;
  /* 버튼의 최소 너비 설정 */
  font-size: 0.9em;
  /* 필요에 따라 텍스트 크기 조정 */
  border: none;
}

.loadMore-btn:hover {
  background-color: #D81B60;
}
* {
  font-family: Orbit;
}
</style>
