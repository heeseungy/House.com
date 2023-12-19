<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

// 컴포넌트들 임포트
import SearchBySelect from "@/components/common/SearchBySelect.vue";
import MapView from "@/components/common/MapView.vue";
import HListVue from "../../components/common/HListVue.vue";
import HDetailVue from "../../components/common/HDetailVue.vue";

// Pinia 스토어 임포트
import { useAddressStore } from "@/stores/addressStore";

// 라우터와 스토어 인스턴스 생성
const router = useRouter();
const addressStore = useAddressStore();

const addressCodes = addressStore.getAddressCode();
const addressNames = addressStore.getAddressName();

// 현재 활성화된 뷰를 추적하는 reactive property
const activeView = ref("HListVue");

// 현재 선택된 아파트 ID를 저장할 ref 생성
const selectedAptId = ref("");

const isAptSelected = ref(false);
// HListVue에서 house-info div 클릭 시 호출될 메소드
// 이 메소드는 선택된 아파트 ID를 저장하고 상세 뷰로 전환

const showDetail = (aptId) => {
  selectedAptId.value = aptId;
  console.log("HouseConents aptId : ", aptId);
  console.log(selectedAptId.value);
  isAptSelected.value = true;
  activeView.value = "HDetailVue";
};

// HDetailVue의 닫기 버튼 클릭 시 호출될 메소드
const showList = () => {
  console.log("HouseContents, showList, X눌러서 나옴 !!");
  getAptList();
  isAptSelected.value = false;
  activeView.value = "HListVue";
};

const URL = "/server";
let token = sessionStorage.getItem("accessToken");

// 아파트 리스트 가져오기
const aptList = ref([]);
const startIndex = ref(0);
const historyCount = ref(50);

// HListVue에서 더보기 버튼을 눌렀을 때 호출될 메소드
const showMoreList = () => {
  startIndex.value = historyCount.value + 1;
  historyCount.value += 9;
  getAptList();
};

const getAptList = async () => {
  addressCodes.value = { ...addressStore.selectedAddressCode };
  console.log(parseInt(addressCodes.value.code3));
  console.log(startIndex.value, historyCount.value);

  try {
    const response = await axios({
      method: "get",
      url:
        URL +
        `/apart/findlist/?dongCode=${addressCodes.value.code3}&startIndex=${startIndex.value}&count=${historyCount.value}`,
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": true,
        Authorization: "Bearer " + token,
      },
    });
    // response.data.data_body.forEach((response) => {
    // aptList.value.push(response);
    // });
    aptList.value = response.data.data_body;
    activeView.value = "HListVue";
  } catch (error) {
    console.log(error);
  }
};

onMounted(async () => {
  // 아파트 리스트 가져오기
  await getAptList();
  console.log("onMounted");
  console.log(aptList);
});

// 검색버튼 눌렀을 때
const onSearch = async (code1, code2, code3) => {
  startIndex.value = 0;
  historyCount.value = 9;
  await getAptList(); // 아파트 리스트가 로드될 때까지 기다림
  // activeView.value = 'HListVue';
  activeView.value = "HListVue";
  // HouseContents.vue로 라우팅
  router.push({
    name: "HouseContents",
    code1,
    code2,
    code3,
  });
};
</script>

<template>
  <!-- ====================================== -->

  <!-- !! 목차 !! -->
  <!-- Category_01 : 검색창과 지도 (col-lg-8)-->
  <!-- Component_01 : 시도/군구/동 select box(select-address) -->
  <!-- Component_02 : Map(map-div) -->

  <!-- Category_02: right-side-title (col-lg-4)-->
  <!--  (삭제) Component_03: X버튼과 동이름(title-basic) -->
  <!-- Component_04: 00동, 00시, 00구 (title-dong) -->
  <!-- Component_05: 주소제목, 도로명주소(title-address) -->

  <!-- Category_03: right-side-list (col-lg-4)-->
  <!-- Component_06: 00개의 검색결과(list-count) -->
  <!-- Component_07: 과거 거래내역(list-all) -->

  <!-- ====================================== -->

  <!-- 전체 화면 구성을 가로로 하기 위한 큰 main-div  Start -->
  <div class="main-div" style="display: flex; flex-direction: column; align-items: center;">
    <!-- <div class="row"> Start -->
    <div class="row" style="display: flex; flex-direction: column; align-items: center; width: 100%;">
      <!-- Category_01 : 검색창과 지도 START -->
      <div id="div1" name="div1" class="col-lg-8">
        <div
          id="select-address"
          name="select-address"
          class="d-flex align-items-center justify-content-between"
        >
          <!-- Component_01 : 시도/군구/동 (select-address) Start -->
          <SearchBySelect
            parentName="HouseContents"
            :addressCodes="addressCodes"
            :addressNames="addressNames"
            @search="onSearch"
          />
        </div>
        <!-- Component_01 : 시도/군구/동 (select-address) End -->
        <!-- Component_02 : Map Start (map-div) -->
        <div
          id="map-div"
          name="map-div"
          class="map-div col-lg-8"
          style="align-items: center"
        >
          <MapView
            :aptList="aptList"
            :selectedAptId="selectedAptId"
            :isAptSelected="isAptSelected"
          />
        </div>
        <!-- Component_02 : Map End (map-div) -->
      </div>
      <!-- Category_01 : 검색창과 지도 End -->
    </div>
    <!-- <div class="row"> End -->
      <!-- Category_02~03 Start -->
      <div class="container-fluid col-lg-8">
        <HListVue
          v-if="activeView === 'HListVue'"
          :aptList="aptList"
          @clickHouseInfo="showDetail"
          @loadMoreApt="showMoreList"
        />
        <HDetailVue
          v-else
          :selectedAptId="selectedAptId"
          @show-list="showList"
        />
      </div>
      <!-- Category_02~03 End -->
  </div>
</template>

<style scoped>
* {
  font-family: Orbit;
}
.map-div {
  /* border-radius: 15px; */
  border: 1px solid black;
  border-collapse: collapse;
  width: auto;
  height: 600px;
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

/* 스크롤바를 숨김 */
/* #right-side-detail::-webkit-scrollbar {
            display: none;
        } */
::-webkit-scrollbar {
  display: none;
}
</style>
