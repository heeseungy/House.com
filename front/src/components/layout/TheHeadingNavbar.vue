<script setup>
import { storeToRefs } from "pinia";
import { useAddressStore } from "@/stores/addressStore";
import { useMemberStore } from "@/stores/member";
import { useRouter, useRoute } from "vue-router";
import { ref } from "vue";

const addressStore = useAddressStore();
const addressCodes = addressStore.getAddressCode();
console.log("navbar에서 찍음", addressCodes);
const addressNames = addressStore.getAddressName();

const memberStore = useMemberStore();
const {isLogin, isValidToken, isAdmin, userName, userEmail} = storeToRefs(memberStore);
const router = useRouter();
const route = useRoute();
console.log("현재 경로: ", route.path);

const logout = () => {
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
  isLogin.value = false;
  isValidToken.value = false;
  userName.value = "";
  isAdmin.value = false;
  userEmail.value = "";
  router.replace("/");
};

const moveMain = () => {
  addressStore.resetAddressState();
  if (route.path === "/") {
    location.reload();
  } else {
    router.replace("/");
  }
};

const moveFavorite = () => {
  addressStore.resetAddressState();
  router.push("/house/favorite")
}
</script>

<template>
  <nav class="navbar-custom navbar-expand-lg navbar" style="background-color: #132141;">
    <!-- justify-content-arout :: nav 간격 설정 mac환경에선 적당히 잘보임 -->
    <div class="container-fluid justify-content-around">
      <a class="navbar-brand" style="cursor: pointer; font-family: Orbit; font-weight: bold; color: white; font-size: 30px;" @click="moveMain()">
        <img
          src="@/assets/img/Logo-removebg.png"
          alt="Logo"
          width="50"
          height="50"
          class="d-inline-block align-text-top"
          
        />
        House.com</a
      >
      <span>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style="border-color: white;"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
          <ul class="navbar-nav">
            <li class="nav-item">
              <!-- <a class="nav-link active" aria-current="page" href="#"
                >공지사항</a
              > -->
              <router-link class="nav-link" to="/notice/list"
                >공지사항</router-link
              >
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/question/list"
                >Q&A</router-link
              >
            </li>
            <li class="nav-item">
              <a @click="moveFavorite" class="nav-link" href=""
                >즐겨찾기</a
              >
            </li>
            <li v-if="!isLogin" class="nav-item">
              <router-link class="nav-link" to="/login">로그인</router-link>
            </li>
            <li v-else class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <strong>{{ userName }}</strong>님 안녕하세요!
              </a>
              <ul class="dropdown-menu">
                <li>
                  <router-link class="dropdown-item" to="/user/mypage"
                    >내 정보</router-link
                  >
                </li>
                <li>
                  <button class="dropdown-item" @click.prevent="logout">
                    로그아웃
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </span>
    </div>
  </nav>
</template>

<style scoped>
li {
  font-family: Orbit;
  font-weight: bold;
  font-size: 18px;
}
.navbar-toggler-icon {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='rgba(255,255,255, 1)' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 8h24M4 16h24M4 24h24'/%3E%3C/svg%3E");
}

.nav-item > a{
  color: white;
}
.nav-item > a:hover{  
  color: #FF8F00;
}
</style>
