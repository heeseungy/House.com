<script setup>
import { ref, onMounted, onUpdated, defineProps, toRaw } from "vue";
import { usePlacesStore } from '@/stores/placesStore';

const placesStore = usePlacesStore();

const props = defineProps({
  aptList: Array,
  selectedAptId: String,
  isAptSelected: Boolean,
});

// 아파트 1개 출력
const findSelectedApt = (apartId, apartList) => {
  console.log("findSelectedApt");
  console.log("apartId: ", apartId);
  console.log("apartList", apartList);
  let lat = null;
  let lng = null;

  // console.log("aptId", props.selectedAptId);
  // console.log("aptId", apartId);
  apartList.forEach((apartment) => {
    // console.log(apartment);
    if (apartment.apt_id == apartId) {
      lat = apartment.lat;
      lng = apartment.lng;
    }
  });

  return [lat, lng];
};

let map = ref(null);

//카카오map을 생성해서 화면에 반영하기 위한 initMap 메소드
//mounted에서 해당 메소드를 이용해서 지도를 생성할 예정
function initMap() {
  const container = document.getElementById("map");
  const options = {
    // center는 "지도 생성"에서 반드시 필요함 --> LatLng 클래로 값을 할당
    center: new kakao.maps.LatLng(33.450701, 126.570667),
    level: 5,
  };

  //지도 객체를 등록합니다.
  //지도 객체는 반응형 관리 대상이 아니므로 initMap에서 선언합니다.
  map.value = new kakao.maps.Map(container, options);
}

// 주변 편의시설 검색
const nearest = [];
// 순서 (MT1:대형마트 / CS2:편의점 / SC4:학교 / OL7:주유소 / SW9:지하철역 / BK9:은행 / FD6:음식점 / CE7:카페 / HP8:병원 / PM9:약국)
// let martDist = 0;
// let storeDist = 0;
// let schoolDist = 0;
// let oilDist = 0;
// let subwayDist = 0;
// let bankDist = 0;
// let restaurantDist = 0;
// let cafeDist = 0;
// let hospitalDist = 0;
// let pharmacyDist = 0;

var nearestPlace = function(result, status) {
  // console.log("주변편의시설 결과는~~ : ", result);
  // console.log("이거슨 응답상태여 ~~ : ", status);

    if (status === kakao.maps.services.Status.OK) {
      console.log("카테고리 값은? : ", result[0].category_group_code);
      
      if (result[0].category_group_code == 'MT1') {
        placesStore.setMartDist(result[0].distance);
        var marker = new kakao.maps.Marker({
          map: map,
          position: new kakao.maps.LatLng(result[0].y, result[0].x),
          // img: ,
        })
        console.log("marker : ", marker);
      }
      else if (result[0].category_group_code == 'CS2') {placesStore.setStoreDist(result[0].distance);}
      else if (result[0].category_group_code == 'SC4') {placesStore.setSchoolDist(result[0].distance);}
      else if (result[0].category_group_code == 'OL7') {placesStore.setOilDist(result[0].distance);}
      else if (result[0].category_group_code == 'SW8') {placesStore.setSubwayDist(result[0].distance);}
      else if (result[0].category_group_code == 'BK9') {placesStore.setBankDist(result[0].distance);}
      else if (result[0].category_group_code == 'FD6') {placesStore.setRestaurantDist(result[0].distance);}
      else if (result[0].category_group_code == 'CE7') {placesStore.setCafeDist(result[0].distance);}
      else if (result[0].category_group_code == 'HP8') {placesStore.setHospitalDist(result[0].distance);}
      else if (result[0].category_group_code == 'PM9') {placesStore.setPharmacyDist(result[0].distance);}

    } else {
      console.log("아 젠장 주변에 편의시설이 없다..!!")
    }
};

// 마커 찍는 함수
// 지도에 마커를 표시하는 함수입니다
function displayMarker(place) {
    // 마커를 생성하고 지도에 표시합니다
    const marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(place.y, place.x) 
    });
}

onUpdated(() => {

  initMap()

  if (props.isAptSelected) {
    const latlng = findSelectedApt(props.selectedAptId, props.aptList);
    // console.log("latlng : ", latlng);
    console.log("아래는 latlng[0], latlng[1] 좌표");
    console.log(latlng[0], latlng[1]);

    // 마커가 표시될 위치
    var markerPosition = new kakao.maps.LatLng(
      Number(latlng[0]),
      Number(latlng[1])
    );

    // // 마커를 생성
    var marker = new kakao.maps.Marker({
      position: markerPosition,
    });

    // console.log("marker");
    // console.log(marker);

    // console.log("map value");
    // console.log(map.value);
    // console.log(map);

    // 마커가 지도 위에 표시되도록 설정
    marker.setMap(toRaw(map.value));
    map.value.panTo(markerPosition);

    // 주변 편의시설 정보 가져오기 -> 최단거리 순 정렬해서 idx=0 가져오기 ->
    // 장소 검색 객체를 생성
    var places = new kakao.maps.services.Places();
    // console.log("places~~~ : ", places)

    // 순서 (MT1:대형마트 / CS2:편의점 / SC4:학교 / OL7:주유소 / SW9:지하철역 / BK9:은행 / FD6:음식점 / CE7:카페 / HP8:병원 / PM9:약국)
    const categoryList = ["MT1", "CS2", "SC4", "OL7", "SW8", "BK9", "FD6", "CE7", "HP8", "PM9"];
    
    categoryList.forEach( async (type) => {
      await places.categorySearch(type, nearestPlace, {
        location: new kakao.maps.LatLng(latlng[0], latlng[1]),
        x: latlng[0],
        y: latlng[1],
        radius: 20000,
        size: 1,
        sort: "distance",
        useMapCenter: true,
        useMapBounds: true
      });
      // displayMarker(places)
    });

  }
  else {
    for (let apt of props.aptList) {
      let markerPosition = new kakao.maps.LatLng(
        Number(apt.lat),
        Number(apt.lng)
      );

      // // 마커를 생성합니다
      const marker = new kakao.maps.Marker({
        position: markerPosition,
      });

      // console.log("marker");
      // console.log(marker);

      // console.log("map value");
      // console.log(map.value);
      // console.log(map);

      // // 마커가 지도 위에 표시되도록 설정합니다
      marker.setMap(toRaw(map.value));
      map.value.panTo(markerPosition);
    }

  }
});

onMounted(() => {
  console.log("props.aptList");
  console.log(props.aptList);
  //여기서 kakao 맵을 화면에 반영합니다.
  //카카오 라이브러리 정보 및 map을 확인
  if (window.kakao && window.kakao.maps) {
    kakao.maps.load(() => initMap()); //지도 초기화 - 상단에 function 선언해 있습니다.
  } else {
    //index.html에 script태그로 들어가있음........
    // //카카오map 라이브러리 정보 셋팅
    // // script태그를 생성해서 apikey를 셋팅해야합니다.
    // const script = document.createElement("script");
    /* global kakao */
    // script.onload = () => kakao.maps.load(initMap())
    // //아래 appkey 부분에 본인의 apikey를 셋팅해주세요.
    // //(카카오 developers에 현재 vue 도메인 정보가 등록되어 있어야합니다.)
    // script.src =
    //   "//dapi.kakao.com/v2/maps/sdk.js?appkey=7d66876074059e65424390a17af3dd70&autoload=false&libraries=services";
    // document.head.appendChild(script);
  }

  console.log("toRaw(props.aptList), props.selectedAptId")
  console.log(toRaw(props.aptList));
  // console.log(props.selectedAptId);
  
});
</script>

<template>
  <div id="map">
  </div>
</template>

<style scoped>
#map {
  width: 100%;
  height: 100%;
}
</style>
