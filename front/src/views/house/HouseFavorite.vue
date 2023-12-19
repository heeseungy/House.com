<script setup>
import SearchBySelect from "@/components/common/SearchBySelect.vue";
// import TMapView from "@/components/common/TMapView.vue";
import HFavoriteVue from "../../components/common/HFavoriteVue.vue";

import axios from "axios";
import { ref, onMounted, watch } from "vue";

import { useAddressStore } from "@/stores/addressStore";
// import { useTmapStore } from "../../stores/Tmap";
import TMapView from "../../components/common/TMapView.vue";

// 현재 활성화된 뷰를 추적하는 reactive property
const activeView = ref("HFavorite");

// 라우터와 스토어 인스턴스 생성
const addressStore = useAddressStore();
// const tmapStore = useTmapStore();

const addressCodes = addressStore.getAddressCode();
const addressNames = addressStore.getAddressName();

// 서버, 토큰
const URL = "/server";
let token = sessionStorage.getItem("accessToken");

// 관심 아파트 리스트 가져오기
const aptList = ref([]);
const groupAptList = ref({});

// 그룹 리스트 가져오기
const groupList = ref([]);
const selectedGroupName = ref("");
const selectedGroupId = ref("");

const resetSearchBar = () => {
  addressStore.resetAddressState();
  location.reload();
};

// storeDist 상태 감시
// let time = ref(0);
// let distance = ref(0);

// watch(() => tmapStore.getTime, (newVal, oldVal) => {
//       console.log(`시간이 변경되었습니다: ${newVal}`);
//       time.value = tmapStore.getTime;
// });

// watch(() => tmapStore.getDistance, (newVal, oldVal) => {
//       console.log(`시간이 변경되었습니다: ${newVal}`);
//       distance.value = tmapStore.getDistance;
// });

const allFavoriteColor = ref("#132141");

const hoverEvent = (isHovering) => {
  console.log(isHovering);
  allFavoriteColor.value = isHovering ? "#FF8F00" : "#132141";
};

const getAptList = async () => {
  addressCodes.value = { ...addressStore.selectedAddressCode };

  try {
    const response = await axios({
      method: "get",
      url:
        URL +
        "/apart/findlist/?dongCode=" +
        addressCodes.value.code3 +
        "&startIndex=0&count=5650&isLike=true&groupId=" +
        selectedGroupId.value,
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": true,
        Authorization: "Bearer " + token,
      },
    });
    aptList.value = response.data.data_body;
  } catch (error) {
    console.log(error);
  }
};

const getGroupAptList = async () => {
  addressCodes.value = { ...addressStore.selectedAddressCode };

  try {
    const response = await axios({
      method: "get",
      url:
        URL +
        "/group/grouplist?dongCode=" +
        addressCodes.value.code3 +
        "&startIndex=0&count=15&isLike=true&groupId=" +
        selectedGroupId.value,
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": true,
        Authorization: "Bearer " + token,
      },
    });
    aptList.value = response.data.data_body.items;
    groupAptList.value = response.data.data_body;
    console.log(groupAptList.value);
  } catch (error) {
    console.log(error);
  }
};

const getGroupList = () => {
  axios({
    method: "get",
    url: URL + "/group/findlist",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": true,
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => {
      groupList.value = res.data.data_body;
    })
    .catch((err) => console.log(err));
};

onMounted(() => {
  getGroupList();
  getAptList();
});

const onSearch = async () => {
  await getAptList();
};

// 그룹 선택시, 그 그룹에 대한 아파트 리스트 출력
const setGroup = () => {
  // 선택한 그룹에 대한 값(그룹 이름, 아이디) 설정
  selectedGroupName.value = document.querySelector(
    "#groupSelectBox>option:checked"
  ).value;
  selectedGroupId.value = document.querySelector(
    "#groupSelectBox>option:checked"
  ).id;
  console.log(selectedGroupId.value, selectedGroupName.value);

  // 해당 그룹에 대한 아파트 리스트 받아오기
  if (selectedGroupId.value == "") {
    // 그룹 선택 안했을 시 관심 버튼 누른 아파트 조회
    getAptList();
  } else {
    aptList.value = [];
    getGroupAptList(); // 그룹 선택 했으면 그 그룹에 속한 아파트 조회
  }
};

const onHeartClick = (data) => {
  console.log(data.aptId);
  axios({
    method: "delete",
    url: URL + "/like/delete/" + data.aptId,
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => {
      getAptList();
    })
    .catch((err) => {
      console.log(err);
    });
};

const onDelete = (data) => {
  axios({
    method: "delete",
    url: `${URL}/group/item/delete?likeId=${data.aptId}&groupId=${data.groupId}`,
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": true,
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => {
      getGroupAptList();
      alert("삭제되었습니다!");
    })
    .catch((err) => {
      console.log(err);
    });
};

// --- 모달 관련 ---
const isModalClick = ref(false);
const selectedAptId = ref("");
const isInputClick = ref(false);
const newGroupName = ref("");

const onAdd = (data) => {
  // 불러온 값으로 세팅
  isModalClick.value = data.isModalClick;
  selectedAptId.value = data.like_id;
};

const onDimmerClick = () => {
  isModalClick.value = false;
};

const onModalAddBtnClick = () => {
  isInputClick.value = true;
};

const onModalInputBtnClick = () => {
  try {
    addNewGroup();
    isInputClick.value = false;
  } catch {
    alert("등록 실패!");
    isInputClick.value = false;
  }
};

const addNewGroup = () => {
  axios({
    method: "post",
    url: URL + "/group/add",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": true,
      Authorization: "Bearer " + token,
    },
    data: {
      group_name: newGroupName.value,
    },
  })
    .then((res) => {
      console.log(res.data);
      getGroupList();
    })
    .catch((err) => {
      alret("해당 그룹에 이미 등록되어 있는 아파트입니다.");
      console.log(err);
    });
  newGroupName.value = "";
};

const deleteGroup = (group) => {
  axios({
    method: "delete",
    url: URL + "/group/delete/" + group.id,
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": true,
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => {
      console.log(res.data);
      getGroupList();
    })
    .catch((err) => {
      console.log(err);
    });
};

const addAptToGroup = (group, likeId) => {
  axios({
    method: "post",
    url: URL + "/group/item/add",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": true,
      Authorization: "Bearer " + token,
    },
    data: {
      like_id: likeId,
      group_id: group.id,
    },
  })
    .then((res) => {
      console.log(res.data);
      alert(`${group.name}에 등록 성공!`);
    })
    .catch((err) => {
      console.log(err.data);
    });
  isModalClick.value = false;
};
</script>

<template>
  <!-- ====================================== -->

  <!-- !! 목차 !! -->
  <!-- Category_01 : 검색창과 지도 (col-lg-8)-->
  <!-- Component_01 : 시도/군구/동 select box(select-address) -->
  <!-- Component_02 : Map(map-div) -->

  <!-- Category_02: right-side-title (col-lg-4)-->
  <!-- Component_03: 모든 즐겨찾기 보기 (title01)-->
  <!-- Component_04: 즐겨찾기 (title02)-->
  <!-- Component_05: 그룹을 선택해 주세요 (title-select) -->

  <!-- Category_03: right-side-list (col-lg-4)-->
  <!-- Component_06: 00개의 즐겨찾는 아파트 (list-count) -->
  <!-- Component_07: 즐겨찾기 리스트 (list-all) -->

  <!-- ====================================== -->

  <!-- 전체 화면 구성을 가로로 하기 위한 큰 main-div  Start -->

    <!-- <div class="row"> Start -->
    <div
      style="
          display: flex;
          flex-direction: column;
          align-items: center;
        ">
      <!-- Category_01 : 검색창과 지도 START -->
      <div id="div1" name="div1" style="width: 70%; display: flex; flex-direction: column; align-items: center;">
        <div id="select-address" name="select-address" style="display: flex; flex-direction: row; width: 100%;">
          <!-- Component_01 : 시도/군구/동 (select-address) Start -->
          <SearchBySelect parentName="HouseFavorite" :addressCodes="addressCodes" :addressNames="addressNames"
            @search="onSearch" />
        </div>
        <!-- Component_03: 모든 즐겨찾기 보기 (title01) Start -->
        <div name="title01" style="padding-top: 5px; padding-bottom: 10px;">
          <div id="all-favorite" @click="resetSearchBar" @mouseover="hoverEvent(true)" @mouseleave="hoverEvent(false)"
            :style="{ color: allFavoriteColor }">
            모든 즐겨찾기 보기
          </div>
        </div>
        <!-- Component_03: 모든 즐겨찾기 보기 (title01) End -->
        <!-- Component_01 : 시도/군구/동 (select-address) End -->
        <!-- Component_02 : Map Start (map-div) -->
        <div id="map-div" name="map-div" class="map-div" style="width: 93%;">
          <TMapView :aptList="aptList" :groupAptList="groupAptList" :groupId="selectedGroupId" />
          <!-- <img src="@/assets/mapimg.JPG" class="img-fluid" style="width: 100%; height: 600px" /> -->
        </div>
        <!-- Component_02 : Map End (map-div) -->
      </div>
      <!-- Category_01 : 검색창과 지도 End -->

      <!-- Category_02~03 Start -->
      <div style="width: 65%">
        <!-- Category_02: right-side-title (col-lg-3) Start -->
        <div id="right-side-title" name="right-side-title">
          <!-- Component_04: 즐겨찾기 (title02) Start -->
          <div style="
                font-family: Orbit;
                font-size: 30px;
                font-weight: bold;
                padding-top: 30px;
                padding-bottom: 30px;
                text-align: center;
              ">
            나의 즐겨찾기
          </div>
          <hr>
          <!-- <div style="display: flex; flex-direction: column;">
                            <span v-if="selectedGroupName === ''"></span>
                            <span v-else style="margin: 10px; font-weight: bold;">총 거리 : {{ distance }} km</span>
                            <span v-if="selectedGroupName === ''"></span>
                            <span v-else style="margin: 10px; font-weight: bold;">예상소요시간 : {{ time }} 분</span>
                          </div> -->
          <!-- Component_04: 즐겨찾기 (title02) End -->
          <!-- Component_05: 그룹을 선택해 주세요 (title-select) Start -->
          <!-- <div name="title-select" style="padding-top: 20px; padding-bottom: 0px; border-bottom: 1px solid rgb(214, 214, 214)">
                          <select id="groupSelectBox" class="form-select m-2" aria-label="Default select example" @change="setGroup">
                            <option selected value="" style="text-align: center">그룹을 선택해주세요</option>
                            <option v-for="group in groupList" :key="group.id" :id="group.id">
                              {{ group.name }}
                            </option>
                          </select>
                        </div> -->
          <!-- Component_05: 그룹을 선택해 주세요 (title-select) End -->
        </div>
        <!-- Category_02: right-side-title (col-lg-3) End -->

        <!-- Category_03: right-side-detail (col-lg-3) Start -->

        <div id="right-side-detail" name="right-side-detail" style="height: 600px">
          <HFavoriteVue v-if="activeView === 'HFavorite'" :aptList="aptList" :groupName="selectedGroupName"
            :groupId="selectedGroupId" @addGroup="onAdd" @onHeartClick="onHeartClick" @deleteGroup="onDelete" />
        </div>
        <!-- Category_03: right-side-detail (col-lg-3) End-->
      </div>
      <!-- Category_02~03 End -->
    </div>
    <!-- <div class="row"> End -->

</template>

<style scoped>
.map-div {
  /* border-radius: 15px; */
  border: 1px solid black;
  height: 500px;
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
  /* text-align: left; */
}

#all-favorite {
  align-items: center;
  font-size: 30px;
  padding-top: 5px;
  padding-bottom: 5px;
  font-family: Orbit;
  font-weight: bold;
  text-align: center;
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

.dimmer {
  z-index: 500;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100% + 100px);
  background-color: rgba(0, 0, 0, 0.2);
}

.modal-container {
  z-index: 1000;
  position: absolute;
  top: 40%;
  left: 40%;
  background-color: white;
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0px 4px 20px 0px rgba(177, 181, 186, 0.18);
  border: none;
}

.modal-title {
  padding: 10px 0 20px 0;
  border-bottom: 1px solid black;
  text-align: center;
}

.group-list-container {
  padding: 20px;
}

.group-item-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  /* justify-content: space-between; */
  /* margin-bottom: 10px; */
}

.group-list-container li {
  cursor: pointer;
}

.group-add-btn-container {
  margin-left: 10px;
  color: #b488cd;
  cursor: pointer;
}
</style>
