<script setup>
import { ref, defineProps, defineEmits, onMounted } from "vue";
import { useAddressStore } from "@/stores/addressStore";
import { useRouter } from "vue-router";
import axios from "axios";

// props를 정의. 부모 컴포넌트로부터 받는 속성들
const props = defineProps({
  parentName: String,
  addressCodes: {
    type: Object,
    add1: String,
    add2: String,
    add3: String,
  },
});

const router = useRouter();

// props가 변경될 때마다 반응하여 값을 업데이트
// watch(props, (newProps) => {
//   if (newProps.add1) sidoCode.value = newProps.add1;
//   if (newProps.add2) gugunCode.value = newProps.add2;
//   if (newProps.add3) dongCode.value = newProps.add3;
// }, { deep: true });

// 주소 관련 상태를 관리하는 스토어를 사용
const addressStore = useAddressStore();

// 이벤트를 발생시키기 위한 emit 함수를 정의
const emit = defineEmits(["search", "hoverEvent"]);

function emitHoverEvent(isHovering) {
  console.log(isHovering)
  emit("hoverEvent", isHovering)
}

// 변수 정의
const URL = "/server"; // CORS 뚫으려고 세팅해논거 ㅇㅇ, 이제 ngrok 서버 바뀌면 vite.config.js 가서 target(url)만 바꿔주면됨ㅇㅇ

const sidoOptions = ref([]);
const gugunOptions = ref([]);
const dongOptions = ref([]);

const sidoName = ref("");
const gugunName = ref("");
const dongName = ref("");

const sidoCode = ref("");
const gugunCode = ref("");
const dongCode = ref("");

// Pinia 스토어에서 저장된 주소 코드를 확인
const addressCodes = addressStore.getAddressCode();
const addressNames = addressStore.getAddressName();

// 컴포넌트가 마운트될 때 초기값을 설정 --> 매우 중요한 코드이자 자산이니 절대 건드리지 마시오...
onMounted(async () => {
  if (addressCodes.code1 === "") {
    setSidoOptions();
  }

  // 저장된 값이 있으면 SelectBox를 해당 값으로 설정
  if (addressCodes.code1 && addressCodes.code2 && addressCodes.code3) {
    sidoCode.value = addressCodes.code1;
    gugunCode.value = addressCodes.code2;
    dongCode.value = addressCodes.code3;
    sidoName.value = addressNames.name1;
    gugunName.value = addressNames.name2;
    dongName.value = addressNames.name3;
    axios.all(
      [
        setSidoOptions(),
        setGugunOptions(addressCodes.code1),
        setDongOptions(addressCodes.code2),
      ].then(
        axios.spread(function (sidos, guguns, dongs) {
          sidoOptions.value = sidos.data.data_body;
          gugunOptions.value = guguns.data.data_body;
          dongOptions.value = dongs.data.data_body;
        })
      )
    );
  }
});

const setSidoOptions = function () {
  axios({
    method: "get",
    url: URL + "/dong/sido_list",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": true,
    },
  })
    .then((response) => {
      sidoOptions.value = response.data.data_body;
      // console.log("불러와진 시/도 리스트 : ", sidoOptions.value);
    })
    .catch((error) => {
      console.log(URL + "/dong/sido_list")
      console.error(error);
    });
};

// Select > Option에 들어갈 값들 세팅
const setGugunOptions = function (sidoCode) {
  axios({
    method: "get",
    url: URL + "/dong/gugun_list/" + sidoCode,
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": true,
    },
  })
    .then((response) => {
      gugunOptions.value = response.data.data_body;
      // console.log("불러와진 구/군 리스트 : ", gugunOptions.value);
    })
    .catch((error) => {
      console.error(error);
    });
};

const setDongOptions = function (gugunCode) {
  axios({
    method: "get",
    url: URL + "/dong/dong_list/" + gugunCode,
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": true,
    },
  })
    .then((response) => {
      dongOptions.value = response.data.data_body;
      // console.log("불러와진 동 리스트 : ", dongOptions.value);
    })
    .catch((error) => {
      console.error(error);
    });
};

// 1개 값을 고름
const selectSido = function () {
  sidoName.value = document.querySelector(
    "#sidoSelectBox>option:checked"
  ).value;
  sidoCode.value = document.querySelector("#sidoSelectBox>option:checked").id;
  // console.log("선택된 sidoName.value : ", sidoName.value);
  // console.log("선택된 sidoCode.value : ", sidoCode.value);
  let gugunSize = document.getElementById("gugunSelectBox");
  let dongSize = document.getElementById("dongSelectBox");
  gugunSize.length = 1;
  dongSize.length = 1;
  setGugunOptions(sidoCode.value);
};

const selectGugun = function () {
  gugunName.value = document.querySelector(
    "#gugunSelectBox>option:checked"
  ).value;
  gugunCode.value = document.querySelector("#gugunSelectBox>option:checked").id;
  // console.log("선택된 gugunName.value : ", gugunName.value);
  // console.log("선택된 gugunCode.value : ", gugunCode.value);
  let dongSize = document.getElementById("dongSelectBox");
  dongSize.length = 1;
  setDongOptions(gugunCode.value);
};

const selectDong = function () {
  dongName.value = document.querySelector(
    "#dongSelectBox>option:checked"
  ).value;
  dongCode.value = document.querySelector("#dongSelectBox>option:checked").id;
  // console.log("선택된 dongName.value : ", dongName.value);
  // console.log("선택된 dongCode.value : ", dongCode.value);
};

// 검색 버튼을 클릭했을 때 호출되는 함수
const search = () => {
  // 토큰이 없다면 !
  console.log("asdfaksdfdsavbasbdvads : ", sessionStorage.getItem("accessToken"))
  if (sessionStorage.getItem("accessToken") == null) {
    alert('로그인을 해주세요.')
    router.push({ name: "login" })
    return;
  }

  // 모든 선택 박스가 선택되었는지 확인
  if (!sidoCode.value || !gugunCode.value || !dongCode.value) {
    alert("조건을 정확히 입력하세요!");
    return; // 조건을 만족하지 않으면 함수의 나머지 부분 실행 중단
  }

  // 주소 스토어에 주소를 추가하고, 'search' 이벤트를 발생
  // if (props.parentName === 'TheMainView') {
  // console.log("parentsName===TheMainView, 시코드(sidoCode.value) : ", sidoCode.value, "구군코드(gugunCode.value) : ", gugunCode.value, "동코드 : ", dongCode.value);
  addressStore.setAddressCode(sidoCode.value, gugunCode.value, dongCode.value); // pinia code1, code2, code3 업데이트
  addressStore.setAddressName(sidoName.value, gugunName.value, dongName.value); // pinia name1, name2, name3 업데이트
  addressStore.addAddressCode({
    code1: sidoCode.value,
    code2: gugunCode.value,
    code3: dongCode.value,
  }); // pinia, 코드 배열에 넣기
  addressStore.addAddressName({
    name1: sidoName.value,
    name2: gugunName.value,
    name3: dongName.value,
  }); // pinia, 이름 배열에 넣기
  emit("search", sidoCode.value, gugunCode.value, dongCode.value);
  // }
  // if (props.parentName === 'HouseContents') {
  //   console.log("parentName===HouseContents, 시코드(sidoCode.value) : ", sidoCode.value, "구군코드(gugunCode.value) : ", gugunCode.value, "동코드 : ", dongCode.value);
  //   addressStore.setAddressCode(sidoCode.value, gugunCode.value, dongCode.value); // pinia code1, code2, code3 업데이트
  //   addressStore.setAddressName(sidoName.value, gugunName.value, dongName.value); // pinia name1, name2, name3 업데이트
  //   addressStore.addAddressCode({ code1: sidoCode.value, code2: gugunCode.value, code3: dongCode.value });  // pinia, 코드 배열에 넣기
  //   addressStore.addAddressName({ name1: sidoName.value, name2: gugunName.value, name3: dongName.value });  // pinia, 이름 배열에 넣기
  //   emit('search', sidoCode.value, gugunCode.value, dongCode.value);
  // }
};
</script>

<template>
  <select id="sidoSelectBox" @change="selectSido" class="form-select m-4" aria-label="Default select example"
    v-model="sidoName" style="text-align: center;">
    <option disabled value="">시/도 선택</option>
    <option v-for="sido in sidoOptions" :key="sido.sido_code" :id="sido.sido_code">
      {{ sido.sido_name }}
    </option>
  </select>
  <select id="gugunSelectBox" @change="selectGugun" class="form-select m-4" aria-label="Default select example"
    v-model="gugunName" style="text-align: center;">
    <option disabled value="">군/구 선택</option>
    <option v-for="gugun in gugunOptions" :key="gugun.gugun_code" :id="gugun.gugun_code" style="color: black">
      {{ gugun.gugun_name }}
    </option>
  </select>
  <select id="dongSelectBox" @change="selectDong" class="form-select m-4" aria-label="Default select example"
    v-model="dongName" style="text-align: center;">
    <option disabled value="">동 선택</option>
    <option v-for="dong in dongOptions" :key="dong.dong_code" :id="dong.dong_code" style="color: black">
      {{ dong.dong_name }}
    </option>
  </select>

  <button @click="search" @mouseover="emitHoverEvent(true)" @mouseleave="emitHoverEvent(false)" type="button" class="btn m-4 text-center">
    검색
  </button>
</template>

<style scoped>
button {
  background-color: #132141;
  color: #fff;
  border-radius: 25px;
  white-space: nowrap;
  min-width: 70px;
  font-family: Orbit;
  font-weight: bold;
  font-size: 20px;
}



button:hover {
  background-color: #132141;
  color: #FF8F00;
  font-weight: bold;
}

* {
  font-family: Orbit;
}

select {
  font-size: 20px;
  font-weight: bold;
  color: #132141;
  border: solid 2px #132141;
  border-radius: 25px;
}

option {
  font-size: 16px;
  font-weight: bold;
  border-radius: 25px;
}

</style>
