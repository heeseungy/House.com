<script setup>
// Vue Composition API 임포트
import {ref, onMounted, onUpdated, defineProps, watch} from "vue";
import axios from "axios";
import { useTmapStore } from "../../stores/Tmap";

const tmapStore = useTmapStore();

const appKey = "4TCqfktj4U8c91figzuyX7ijb6SVpVbM9N35mw0I";
const resultdrawArr = ref([]);

// 지도와 마커용 ref
let map = ref(null);
let markers = ref([]);

// 부모 컴포넌트에서 받는 props - aptList
const props = defineProps({
  aptList: Array, // 아파트 정보가 담겨있는 Array
  groupAptList: Array, // 그룹 선택했을 때 출발지 좌표, 경유지 좌표, 도착지 좌표 담겨 있는 Object
  groupId: Number, // 선택된 그룹 아이디 (값이 있으면 경로 띄우고, 아니면 마커 찍음)
});

// aptList 변경 시 실행될 watcher
watch(
  () => props.aptList,
  (newVal, oldVal) => {
    // aptList 변경시 로그, 마커 클리어 및 업데이트
    // console.log(`Tmap, aptList가 변경되었습니다: ${JSON.stringify(newVal, null, 2)}`);
    clearMarkers();
    updateMap();
    makeMarkers(newVal);
  }
);

// 지도 초기화 함수
function initTmap() {
  // 지도가 없을 경우에만 생성
  if (!map.value) {
    map.value = new Tmapv2.Map("map_div", {
      center: new Tmapv2.LatLng(36.34, 127.77),
      width: "100%",
      height: "100%",
      zoom: 8,
    });
  }
}

// 지도 업데이트 함수
function updateMap() {
  // 지도 중심 재설정
  if (map.value && props.aptList.length > 0 && !props.groupId) {
    clearLine();
    const firstApt = props.aptList[0];
    map.value.setCenter(new Tmapv2.LatLng(36.34, 127.77));
    map.value.setZoom(7);
  } else if (map.value && props.groupId && props.aptList.length > 0) {
    const firstApt = props.aptList[0];
    map.value.setCenter(new Tmapv2.LatLng(Number(firstApt.lat), Number(firstApt.lng)));
    map.value.setZoom(15);
    searchRoute(props.groupAptList);
  }
}

// 마커 생성 함수
function makeMarkers(aptList) {
  // 기존 마커 클리어 후 새로 생성
  clearMarkers();
  aptList.forEach((apt) => {
    const marker = new Tmapv2.Marker({
      position: new Tmapv2.LatLng(Number(apt.lat), Number(apt.lng)),
      map: map.value,
    });
    markers.value.push(marker);
  });
}

// 마커 클리어 함수
function clearMarkers() {
  // 모든 마커 제거
  markers.value.forEach((marker) => marker.setMap(null));
  markers.value = [];
}

// 보행자 경로 찾는 함수
function searchRoute(groupAptList) {
  var headers = {};
  headers["appKey"] = "4TCqfktj4U8c91figzuyX7ijb6SVpVbM9N35mw0I";
  axios({
    method: "post",
    headers: headers,
    url: "https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&callback=result",
    data: {
      //   startX: "126.983937",
      //   startY: "37.564991",
      //   endX: "126.988940",
      //   endY: "37.566158",
      startX: `${groupAptList.start_x}`,
      startY: `${groupAptList.start_y}`,
      endX: `${groupAptList.end_x}`,
      endY: `${groupAptList.end_y}`,
      passList: `${groupAptList.pass_list}`,
      reqCoordType: "WGS84GEO",
      resCoordType: "EPSG3857",
      startName: "출발지",
      endName: "도착지",
    },
  })
    .then((response) => {
      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
      const resultData = response.data.features;
      drawLine(resultData);
      console.log((resultData[0].properties.totalTime / 60).toFixed(0) + "분");
      console.log("총 거리 : " + (resultData[0].properties.totalDistance / 1000).toFixed(1) + "km,");
      tmapStore.setTime(Number((resultData[0].properties.totalTime / 60).toFixed(0)));
      tmapStore.setDistance(Number((resultData[0].properties.totalDistance / 1000).toFixed(1)))
    })
    .catch((error) => {
      console.error("경로 탐색 API 오류:", error);
    });
}

// 찾은 보행자 경로를 따라 선을 그리는 함수
function drawLine(resultData) {
  clearLine();

  let drawInfoArr = [];
  resultData.forEach((data) => {
    if (data.geometry.type === "LineString") {
      data.geometry.coordinates.forEach((coord) => {
        const point = new Tmapv2.Point(coord[0], coord[1]);
        const latLng = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(point);
        drawInfoArr.push(new Tmapv2.LatLng(latLng._lat, latLng._lng));
      });
    }
  });

  const polyline = new Tmapv2.Polyline({
    path: drawInfoArr,
    strokeColor: "#DD0000",
    strokeWeight: 7,
    map: map.value,
  });

  resultdrawArr.value.push(polyline);
}

// 그려진 선을 지우는 함수
function clearLine() {
  resultdrawArr.value.forEach((line) => line.setMap(null));
  resultdrawArr.value = [];
}

// 컴포넌트 마운트 시 지도 초기화
onMounted(() => {
  initTmap();
});

// 컴포넌트 업데이트 시 지도 업데이트
onUpdated(() => {
  updateMap();
});
</script>

<template>
  <!-- 지도 표시 div -->
  <div id="map_div" name="map_div" class="map_div" style="width: 100%; height: 100%"></div>
</template>

<style scoped></style>
