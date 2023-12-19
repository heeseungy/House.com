<script setup>
import { ref, onMounted, onUnmounted, watch, defineEmits } from "vue";
import { useAddressStore } from "../../stores/addressStore";
import { usePlacesStore } from '@/stores/placesStore';
import axios from "axios";

import heartOn from "@/assets/Button_하트 on.png";
import heartOff from "@/assets/Button_하트 off.png";

import oilImg from "@/assets/oilImg.png";
import subwayImg from "@/assets/train.png";
import restaurantImg from "@/assets/restaurant.png";
import martImg from "@/assets/grocery-store.png";
import bankImg from "@/assets/bank-building.png";
import hospitalImg from "@/assets/pharmacy.png";
import pharmacyImg from "@/assets/pill.png";
import cafeImg from "@/assets/coffee.png";
import storeImg from "@/assets/basket.png";
import schoolImg from "@/assets/school.png";

// pinia instance 생성
const addressStore = useAddressStore();
const placesStore = usePlacesStore();
const addressNames = addressStore.getAddressName();

const rightSideDetailHeight = ref(0);

const heartButtonSrc = ref(heartOn);

const emit = defineEmits(["closeEmits"]);

// 닫기 버튼 클릭 이벤트를 위한 메소드
const closeDetail = () => {
  // HouseContents.vue에 이벤트를 발생시킴
  emit("show-list");
};

// props를 정의. 부모 컴포넌트로부터 받는 속성들
const props = defineProps({
  selectedAptId: String,
});
console.log("선택한 아파트는 ~~~ : ", props.selectedAptId);

// 아파트 상세보기 - axios 날릴 주소 : /apart/find/29200000000058/1
const URL = "/server";
let token = sessionStorage.getItem("accessToken");
const userId = "1"; // 로그인한 사용자의 실제 ID로 대체

// 1. 아파트 상세정보 가져오기
const aptDetail = ref([]);
const aptName = ref("");

const getAptDetail = async (aptId) => {
  try {
    const response = await axios({
      method: "get",
      url: URL + "/apart/find/" + aptId,
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": true,
        Authorization: "Bearer " + token,
      },
    });
    aptDetail.value = response.data.data_body;
    aptName.value = aptDetail.value.apt_name;
    // console.log('aptName.value : ', aptName.value);
    // console.log('aptDetail.value : ', aptDetail.value);
  } catch (error) {
    console.error(error);
  }
};

// 2. 아파트 거래내역 가져오기
// /apart/history/?apartcode=26110000000001&startIndex=0&count=100
const aptHistory = ref([]);

const getAptHistory = async (aptId) => {
  // console.log("getAptHistory 함수인데... getAPtDetail을 조회..! : ", getAptDetail.value)
  try {
    const response = await axios({
      method: "get",
      url:
        URL +
        "/apart/history/?apartCode=" +
        aptId +
        "&startIndex=0&count=" +
        historyCount.value,
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": true,
        Authorization: "Bearer " + token,
      },
    });
    aptHistory.value = response.data.data_body;
    console.log(aptHistory.value);
  } catch (error) {
    console.log(error);
  }
};

const historyCount = ref(5); // 초기값을 5로 설정
const reviewsCount = ref(5);
const newsCount = ref(5);

const loadMoreHistory = () => {
  historyCount.value += 5; // count를 5씩 증가
  getAptHistory(props.selectedAptId);
};

const loadMoreReview = () => {
  reviewsCount.value += 5;
  getReviews(props.selectedAptId);
};

// const loadMoreNews = () => {
//     newsCount.value += 5;
//     getNews()
// };

// 3. 아파트 주변 편의시설 가져오기 --> 지도 붙인 이후..
// 변수들
let martDist = 0;
let storeDist = 0;
let schoolDist = 0;
let oilDist = 0;
let subwayDist = 0;
let bankDist = 0;
let restaurantDist = 0;
let cafeDist = 0;
let hospitalDist = 0;
let pharmacyDist = 0;

// martDist 상태 감시
watch(() => placesStore.getMartDist, (newVal, oldVal) => {
      console.log(`마트 거리가 변경되었습니다: ${newVal}`);
      martDist = placesStore.getMartDist;
});
// storeDist 상태 감시
watch(() => placesStore.getStoreDist, (newVal, oldVal) => {
      console.log(`편의점 거리가 변경되었습니다: ${newVal}`);
      storeDist = placesStore.getStoreDist;
});
// schoolDist 상태 감시
watch(() => placesStore.getSchoolDist, (newVal, oldVal) => {
      console.log(`학교 거리가 변경되었습니다: ${newVal}`);
      schoolDist = placesStore.getSchoolDist;
});
// oilDist 상태 감시
watch(() => placesStore.getOilDist, (newVal, oldVal) => {
      console.log(`주유소 거리가 변경되었습니다: ${newVal}`);
      oilDist = placesStore.getOilDist;
});
// subwayDist 상태 감시
watch(() => placesStore.getSubwayDist, (newVal, oldVal) => {
      console.log(`지하철 거리가 변경되었습니다: ${newVal}`);
      subwayDist = placesStore.getSubwayDist;
});
// bankDist 상태 감시
watch(() => placesStore.getBankDist, (newVal, oldVal) => {
      console.log(`은행 거리가 변경되었습니다: ${newVal}`);
      bankDist = placesStore.getBankDist;
});
// restaurantDist 상태 감시
watch(() => placesStore.getRestaurantDist, (newVal, oldVal) => {
      console.log(`음식점 거리가 변경되었습니다: ${newVal}`);
      restaurantDist = placesStore.getRestaurantDist;
});
// cafeDist 상태 감시
watch(() => placesStore.getCafeDist, (newVal, oldVal) => {
      console.log(`카페 거리가 변경되었습니다: ${newVal}`);
      cafeDist = placesStore.getCafeDist;
});
// hospitalDist 상태 감시
watch(() => placesStore.getHospitalDist, (newVal, oldVal) => {
      console.log(`병원 거리가 변경되었습니다: ${newVal}`);
      hospitalDist = placesStore.getHospitalDist;
});
// pharmacyDist 상태 감시
watch(() => placesStore.getPharmacyDist, (newVal, oldVal) => {
      console.log(`약국 거리가 변경되었습니다: ${newVal}`);
      pharmacyDist = placesStore.getPharmacyDist;
});


// 4. 아파트별 댓글 등록하기
// Axios를 사용하여 POST 요청 보내기
const reviewContent = ref(""); // 사용자가 입력한 리뷰 내용을 저장할 ref

// // input과 button 요소를 선택
// const input = document.getElementById('regist-review-input');
// const button = document.getElementById('regist-review-btn');

// // input 요소에 keydown 이벤트 리스너 추가
// input.addEventListener('keydown', function(event) {
//     // Enter 키가 눌렸는지 확인
//     if (event.key === 'Enter') {
//         // Enter 키가 눌렸다면 button의 click 이벤트를 트리거
//         button.click();
//     }
// });

// Axios POST 요청을 보내는 함수
const postReview = async () => {
  if (!reviewContent.value.trim()) {
    alert("리뷰 내용을 입력해주세요.");
    return;
  }

  const postData = {
    content: reviewContent.value,
    apt_code: props.selectedAptId,
  };

  try {
    const response = await axios.post(URL + "/review/add/" , postData, {
      headers: {
        // 기존 헤더가 있다면 여기에 추가
        'Authorization': "Bearer " + token
      }
    });
    console.log("Response: ", response.data);
    // 성공적으로 리뷰가 등록된 후에는 reviewContent를 초기화
    reviewContent.value = "";
    getReviews(props.selectedAptId);
  } catch (error) {
    console.error("Error:", error);
  }
};

// 5. 아파트별 댓글리스트 가져오기
// /review/findlist?aptCode=11110000000042&startIndex=0&count=100
const aptReviews = ref([]);

const getReviews = async (aptId) => {
  try {
    const response = await axios({
      method: "get",
      url:
        URL +
        "/review/findlist?aptCode=" +
        aptId +
        "&startIndex=0&count=" +
        reviewsCount.value,
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": true,
        Authorization: "Bearer " + token,
      },
    });
    aptReviews.value = response.data.data_body;
    console.log(aptReviews.value);
  } catch (error) {
    console.log(error);
  }
};

// 6. 뉴스기사 가져오기
// /news?searchText=어쩌구빌라&startIndex=0&count=3
// 사진: thumbnail_link
// 링크: link
// 헤드라인: title
// 요약: description
// 등록일: pub_date

const aptNewsList = ref([]);
// url: URL + "/news?searchText=" + addressNames.name1 + " " + addressNames.name2 + " " + addressNames.name3 + " 부동산&startIndex=0&count=" + newsCount.value,
const getNews = async (aptId) => {
  try {
    const response = await axios({
      method: "get",
      url: URL + "/news?aptCode=" + aptId + "&startIndex=0&count=" + newsCount.value,
      // url: URL + "/news?searchText=" + addressNames.name1 + " " + addressNames.name2 + " " + addressNames.name3 + " 부동산&startIndex=0&count=" + newsCount.value,
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": true,
        Authorization: "Bearer " + token,
      },
    });
    console.log("asdnivvniwngviwaunvia", aptId)
    aptNewsList.value = response.data.data_body;
    console.log(aptNewsList.value);
  } catch (error) {
    console.log(error);
  }
};

// 설명을 잘라주는 함수
const truncateDescription = (description) => {
  const maxLength = 110
  return description.length > maxLength
    ? description.substring(0, maxLength) + ' ...'
    : description
}

// 제목 눌렀을 때, 외부 링크를 통해 기사본문 연결해주는 함수
const clickNewsTitle = (param) => {
  console.log("afasdfas fasd : ", param);
  // window.open 으로 새 탭에서 열기
  window.open(param, '_blank');
  // window.location.href = aptNewsList.value.link
};

// onMounted() !!!!!!!!!!!!!!!!!!!!!!!!!
onMounted(() => {
  // 1. 아파트 상세정보 가져오기
  getAptDetail(props.selectedAptId);
  console.log(aptName);
  // 2. 아파트 거래내역 가져오기
  getAptHistory(props.selectedAptId);

  // 3. 아파트 주변 편의시설 가져오기 --> 지도 붙인 이후..

  // 4. onMounted 할 필요 없음

  // 5. 아파트별 댓글 정보 가져오기
  getReviews(props.selectedAptId);

  // 6. 뉴스기사 가져오기
  getNews(props.selectedAptId);
});

// 이미지 토글 함수
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
        console.log(URL + "/like/add/" + apt.apt_id + "/1");
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
  <div id="right-side-title" name="right-side-title" style="display: flex; justify-content: space-between;">
    <!-- Component_03: X버튼과 동이름 ~ 신도로명 주소 (title-basic) Start -->
    <div
      class="custom-row"
      style="justify-content: space-between; padding-top: 15px; padding-bottom: 15px; display: flex; flex-direction: column;">
      <span style="font-weight: bold; font-size: 30px; font-family: Orbit; font-weight: bold;">
      {{ addressNames.name3 }}, {{ addressNames.name1 }} {{ addressNames.name2 }}
        {{ aptDetail.apt_road_name }} {{ aptDetail.apt_road_name_bonbun }}</span>

        <span class="aptN-name" style="font-weight: bold; font-size: 25px; font-family: Orbit; font-weight: bold;">
          {{ aptDetail.apt_name }}({{ addressNames.name2 }} {{ aptDetail.dong }} {{ aptDetail.bonbun }})
        </span>
    </div>

    <div style="display: flex; flex-direction: row;">
      <div style="justify-content: center">
        <a href="#" @click="toggleImage(aptDetail)">
          <img
            id="heartButton"
            :src="aptDetail.like_status ? heartOn : heartOff"
            alt="heart Button"
            style="width: 110px; height: 110px"
          />
        </a>
      </div>
      <div style="display: flex;flex-direction: row;align-items: center;justify-content: space-between;">
        <button
          type="button"
          class="btn-close"
          aria-label="Close"
          @click="closeDetail"
          style="font-size: 60px"
        ></button>
      </div>
    </div>
      

    
    <!-- Component_03: X버튼과 동이름 ~ 신도로명 주소 (title-basic) End -->
  </div>


  <!-- Category_02: right-side-title (col-lg-3) End -->
<hr>
<br>
<nav id="navbar-example2" class="navbar navbar-light bg-light px-3">
  <ul class="nav nav-pills">
    <li class="nav-item">
      <a class="nav-link" href="#detail-nearby" style="color: #132141; font-size: 25px; font-weight: bold;">주변편의시설</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="#detail-news" style="color: #132141; font-size: 25px; font-weight: bold;">관련뉴스</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="#detail-history" style="color: #132141; font-size: 25px; font-weight: bold;">거래내역</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="#detail-review" style="color: #132141; font-size: 25px; font-weight: bold;">아파트리뷰</a>
    </li>
  </ul>
  <a class="navbar-brand" href="#top" style="color: #132141; font-size: 25px; font-weight: bold;">상단으로 이동</a>
</nav>
  <br />

  <!-- Category_03: right-side-detail (col-lg-3) Start -->

  <div
    id="right-side-detail"
    name="right-side-detail"
    style="height: 800px;"
  >
    <!-- Component_04: 전세사기 조회결과(detail- fraud) Start -->
    <!-- <div name="detail- fraud">
                        <div class="custom-row" style="font-weight: bold; font-size: 18px;">
                            <div class="element full-width">안전 아파트</div>
                        </div>
                        <div class="custom-row">
                            <div class="element full-width" style="font-size: 16px;">매매 대비 전세 비율이 평균 대비 10% 낮습니다</div>
                        </div>
                    </div> -->
    <!-- Component_04: 전세사기 조회결과(detail- fraud) End -->

    <br />



    <br><br><br>
    <!-- Component_06: 주변 편의시설(detail-nearby) Start -->
    <div id="detail-nearby" name="detail-nearby">
      <div
        class="element full-width" style="font-weight: bold; font-size: 30px;border-bottom: 0.5px solid black;font-family: Orbit; font-weight: bold; text-align: center; padding-bottom: 15px;">
        주변 편의시설
      </div>
      <div name="detail-nearby-content">
        <div class="custom-row">
          <div class="element" style="width: 40px; font-family: Orbit; font-weight: bold;">
            <img :src="oilImg" style="width: 40px; height: 40px" />
            <span style="font-weight: bold;"> 주유소 </span>
            <span style="font-weight: normal;"> {{ Number(oilDist) === 0 ? '-' : `${Number(oilDist)} m` }}</span>
          </div>
          <div class="element" style="width: 40px; font-family: Orbit; font-weight: bold;">
            <img :src="hospitalImg" style="width: 40px; height: 40px" />
            <span style="font-weight: bold;"> 병원 </span><t></t>
            <span style="font-weight: normal;"> {{ Number(hospitalDist) === 0 ? '-' : `${Number(hospitalDist)} m` }}</span>
          </div>
        </div>
        <div class="custom-row">
          <div class="element" style="width: 110px; font-family: Orbit; font-weight: bold;">
            <img :src="subwayImg" style="width: 40px; height: 40px" />
            <span style="font-weight: bold;"> 지하철역 </span>
            <span style="font-weight: normal;"> {{ Number(subwayDist) === 0 ? '-' : `${Number(subwayDist)} m`}}</span>
          </div>
          <div class="element" style="width: 110px; font-family: Orbit; font-weight: bold;">
            <img :src="pharmacyImg" style="width: 40px; height: 40px" />
            <span style="font-weight: bold;"> 약국 </span>
            <span style="font-weight: normal;">{{ Number(pharmacyDist) === 0 ? '-' : `${Number(pharmacyDist)} m` }}</span>
          </div>
        </div>
        <div class="custom-row">
          <div class="element" style="width: 110px; font-family: Orbit; font-weight: bold;">
            <img :src="restaurantImg" style="width: 40px; height: 40px" />
            <span style="font-weight: bold;"> 식당 </span>
            <span style="font-weight: normal;">{{ Number(restaurantDist) === 0 ? '-' : `${Number(restaurantDist)} m` }}</span>
          </div>
          <div class="element" style="width: 110px; font-family: Orbit; font-weight: bold;">
            <img :src="cafeImg" style="width: 40px; height: 40px" />
            <span style="font-weight: bold;"> 카페 </span>
            <span style="font-weight: normal;">{{ Number(cafeDist) === 0 ? '-' : `${Number(cafeDist)} m` }}</span>
          </div>
        </div>
        <div class="custom-row">
          <div class="element" style="width: 110px; font-family: Orbit; font-weight: bold;">
            <img :src="martImg" style="width: 40px; height: 40px" />
            <span style="font-weight: bold;"> 마트 </span>
            <span style="font-weight: normal;">{{ Number(martDist) === 0 ? '-' : `${Number(martDist)} m` }}</span>
          </div>
          <div class="element" style="width: 110px; font-family: Orbit; font-weight: bold;">
            <img :src="storeImg" style="width: 40px; height: 40px" />
            <span style="font-weight: bold;"> 편의점 </span>
            <span style="font-weight: normal;">{{ Number(storeDist) === 0 ? '-' : `${Number(storeDist)} m` }}</span>
          </div>
        </div>
        <div class="custom-row">
          <div class="element" style="width: 110px; font-family: Orbit; font-weight: bold;">
            <img :src="bankImg" style="width: 40px; height: 40px" />
            <span style="font-weight: bold;"> 은행 </span>
            <span style="font-weight: normal;">{{ Number(bankDist) === 0 ? '-' : `${Number(bankDist)} m` }}</span>
          </div>
          <div class="element" style="width: 110px; font-family: Orbit; font-weight: bold;">
            <img :src="schoolImg" style="width: 40px; height: 40px" />
            <span style="font-weight: bold;"> 학교 </span>
            <span style="font-weight: normal;">{{ Number(schoolDist) === 0 ? '-' : `${Number(schoolDist)} m` }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- Component_06: 주변 편의시설(detail-nearby) End -->

    <br><br><br>

<!-- Component_09: 뉴스기사 Start -->
<div name="detail-news">
  <div class="custom-row">
    <div
      id="detail-news"
      class="element"
      style="font-weight: bold; font-size: 30px; font-family: Orbit; text-align: center; padding-bottom: 20px; border-bottom: 1px solid black;
      "
    >
      관련 뉴스
    </div>
  </div>
  <!-- 기사 시작 -->
  <div
    v-for="aptNews in aptNewsList"
    :key="aptNews.link"
    :id="aptNews.link"
    style="display: flex; padding-bottom: 10px; padding-top: 15px;"
  >
    <div name="news-img" style="width: 300px; height: 100%">
      <img
        :src="aptNews.thumbnail_link"
        style="width: 300px; height: 150px; object-fit: cover;"
      />
    </div>
    <div style="display: flex; flex-direction: column; justify-content: space-between;">
      <div class="custom-row">
        <div
          
          @click="clickNewsTitle(aptNews.link)"
          class=""
          style="font-weight: bold; font-size: 25px; padding-left: 10px;"
        >
          <a id="news-title">{{ aptNews.title }}</a>
        </div>
      </div>
      <div>
        <div class="custom-row">
          <div class="" style="font-size: 20px; padding-left: 10px; text-overflow: ellipsis; overflow: hidden;  white-space:">
            {{ truncateDescription(aptNews.description) }}
          </div>
        </div>
        <div
          class=""
          style="display: flex; color: gray; padding-left: 10px; font-size: 15px;"
        >
          <span style="font-size: 18px;">{{ aptNews.pub_date }} </span>
          <span style="font-size: 18px;"> / </span>
          <span style="font-weight: bold; font-size: 18px;"> {{ aptNews.media_company }}</span>
        </div>
      </div>
    </div>
  </div>
  <!-- 기사 끝 -->
</div>
<!-- Component_09: 뉴스기사 End -->

    <br><br><br>
        <!-- Component_05: 과거 거래내역(detail-history) Start -->
        <div id="detail-history" class="detail-history" name="detail-history">
      <div class="custom-row">
        <div
          class="element full-width"
          style="font-weight: bold; font-size: 30px;  font-family: Orbit; font-weight: bold; text-align: center; padding-bottom: 20px;"
        >
          거래내역
        </div>
      </div>

      <table style="width: 100%; height:10px text-align: center;">
        <thead>
          <tr
            style="
              border-bottom: 0.5px solid black;
              border-top: 0.5px solid black;
              font-family: Orbit; font-weight: bold;
            "
          >
            <th style="font-size: 25px;">거래일</th>
            <th style="font-size: 25px;">유형</th>
            <th style="font-size: 25px;">면적</th>
            <th style="font-size: 25px;">층</th>
            <th style="font-size: 25px;">거래금액</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="history in aptHistory"
            :key="history.apt_id"
            :id="history.apt_id"
            style=" font-family: Orbit; font-weight: bold;"
          >
            <td>{{ history.deal_date }}</td>
            <td>{{ history.type }}</td>
            <td>{{ history.area }} ㎡</td>
            <td>{{ history.floor }} 층</td>
            <td>{{ history.deal_amount }} (만)원</td>
          </tr>
        </tbody>
      </table>
      <div style="text-align: center; margin-top: 20px">
        <button class="loadMore-btn" @click="loadMoreHistory">더보기</button>
      </div>
    </div>
    <!-- Component_05: 과거 거래내역(detail-history) End -->
    <br><br><br>

    
    <!-- Component_08: 아파트 리뷰(detail-review) Start -->
    <div id="detail-review" name="detail-review">
      <div class="custom-row">
        <div
          class="element full-width"
          style="font-weight: bold; font-size: 30px;  font-family: Orbit; font-weight: bold; text-align: center; padding-bottom: 20px; border-bottom: 1px black solid;"
        >
          아파트 리뷰
        </div>
      </div>


<!-- Component_07: 댓글 작성(detail-writeReview) Start-->
<div name="detail-writeReview" class="container-fluid">
      <label
        style="display: flex; align-items: center; justify-content: space-between; margin: 1em 0;">
        <div class="input-group">
          <input id="regist-review-input" type="text" class="form-control" placeholder="댓글을 작성하세요." v-model="reviewContent" style="border-color: #132141; font-size: 20px;">
          <button id="regist-review-btn" class="btn btn-custom" type="button" @click="postReview" style="font-size: 20px; background-color: #132141; font-weight: bold;">댓글 작성</button>
        </div>
      </label>
    </div>
    <!-- Component_07: 댓글 작성(detail-writeReview) End-->



      <div
        v-for="review in aptReviews"
        :key="review.review_id"
        :id="review.review_id"
      >
        <div class="custom-row">
          <div
            class="element three-fifths"
            style="font-weight: bold; font-size: 25px"
          >
            {{ review.writer_name }}
          </div>
          <div
            class="element two-fifths"
            style="text-align: right; font-size: 20px"
          >
            {{ review.create_time }}
          </div>
        </div>
        <div class="custom-row">
          <div class="element full-width" style="font-size: 25px">
            {{ review.content }}
          </div>
        </div>
      </div>
    </div>
    <div style="text-align: center; margin-top: 20px; padding-bottom: 15px">
      <button class="loadMore-btn" @click="loadMoreReview">더보기</button>
    </div>
    <!-- Component_08: 아파트 리뷰(detail-review) End-->

    
    <div style="text-align: center; margin: 10px 0; font-size: 35px; font-weight: bold;">
      마지막 항목
    </div>
    <!-- Category_03: right-side-detail (col-lg-3) End-->
  </div>
</template>

<style scoped>
* {
  /* font: "Orbit" !important; */
  font-family: Orbit;
}
.map-div {
  /* border-radius: 15px; */
  border: 1px solid black;
  border-collapse: collapse;
  width: auto;
  height: 800px;
}

span {
  font-size: 25px;
}

.news-title:hover {
  color: #FF8F00;
}

.bordered-table,
.bordered-table th,
.bordered-table td {
  border: 1px solid black;
  border-collapse: collapse;
}


.comment-btn,
.loadMore-btn {
  padding: 0.5em 1em;
  /* 패딩을 적절히 조정 */
  background-color: #132141;
  color: white;
  border-radius: 25px;
  white-space: nowrap;
  /* 필요에 따라 normal로 변경 */
  font-weight: bold;
  overflow: hidden;
  min-width: 100px;
  font-size: 20px;
  border: none;
}

.loadMore-btn:hover {
  background-color: #FF8F00;
  color: black;
}

#regist-review-btn:hover {
  background-color: #FF8F00 !important;
  color: #132141;
}

.custom-btn {
    background-color: #132141; /* 기본 배경 색상 */
    color: white; /* 텍스트 색상 */
    border: none; /* 테두리 제거 */
}
.custom-btn:hover {
    background-color: #FF8F00; /* 마우스 오버 시 배경 색상 */
}

.custom-row {
  display: flex;
  padding-top: 5px;
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
  font-size: 20px;
  text-align: center;
}

.detail-history {
  height: auto;
  /* 원하는 높이로 설정 */
  overflow-y: auto;
  /* 세로 스크롤 허용 */
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

.btn-custom{
  background: #FF8F00;
  color: white;
  border-radius: 5px;
}
.btn-custom:hover{
  background: #D81B60;
  color: white;
}
.form-control{
  border-color: #FF8F00;
}

.nav-link:hover {
  color: #FF8F00 !important;
}

.navbar-brand:hover {
  color: #FF8F00 !important;
}


</style>
