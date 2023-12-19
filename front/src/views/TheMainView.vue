<script setup>
import SearchBySelect from "@/components/common/SearchBySelect.vue";
import { ref, onMounted } from "vue";
import { useAddressStore } from "@/stores/addressStore";
import { useRouter } from 'vue-router';

import mainGIF from '@/assets/img/main2.gif';

const addressStore = useAddressStore();
const router = useRouter();

const spanColor = ref('#132141');
const spanSize = ref('32px')
function handleHoverEvent(isHovering) {
  // 이벤트 처리
  console.log("themain : ", isHovering)
  spanColor.value = isHovering ? "#cc1245" : "#132141";
  spanSize.value = isHovering ? "35px" : "32px";
}

onMounted (() => {
  console.log(addressStore.selectedAddressCode);

})


// 검색 버튼을 누를 때 실행될 함수
const onSearch = (code1, code2, code3) => {
  // const addressCodes = addressStore.getAddressCode();
  // console.log("TheMainView addressStore.getAddress() : ", addressCodes);
  // console.log("Main, onSearch함수, addressCodes.code1 : ", addressCodes.code1);
  // console.log("Main, onSearch함수, addressCodes.code2 : ", addressCodes.code2);
  // console.log("Main, onSearch함수, addressCodes.code3 : ", addressCodes.code3);
  // console.log("이건 onsearch param : ", code1, code2, code3)
  // console.log("위에 찍힌 애들을 router.push 쿼리로 넘긴다. 부모 이름이랑")
  // HouseContents.vue로 라우팅
  router.push({
    name: "HouseContents", code1, code2, code3
  });
};  
</script>

<template>
    <div style="display: flex; justify-content: center; padding: 50px;">
      <div id="main-div" style="display: flex; justify-content: center; align-items: center; width: 70%; height: 650px; background-size: cover; border-radius: 15px; background-position: center;" :style="{backgroundImage: `url(${mainGIF})`}">
        <div style="max-width: 60%; width: 100%; padding: 15px; box-sizing: border-box; border-radius: 15px; background-color: rgba(255, 255, 255, 0.5); backdrop-filter: blur(3px);">
            <span>내가 찾던 집,</span>
            <span><a id="there" :style="{color: spanColor, fontSize: spanSize}">그 곳에™</a></span>
            <div style="display: flex; flex-direction: row; justify-content: center;">
            <!-- 검색 폼 -->
            <SearchBySelect parentName="TheMainView" @search="onSearch" @hoverEvent="handleHoverEvent" />
            </div>
        </div>
      </div>
    </div>
      <!-- 최근 검색 -->
</template>

<style scoped>
span {
  text-align: left;
  color: white;
  font-family: Orbit;
  font-weight: bold;
  padding-left: 25px;
  font-size: 32px
}

.there {
  font-weight: bold;
}
</style>
