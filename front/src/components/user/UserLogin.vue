<script setup>
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useMemberStore } from '@/stores/member';

const router = useRouter();
const memberStore = useMemberStore();
const {isLogin} = storeToRefs(memberStore);
const {userLogin, getUserInfo, authLogin} = memberStore;

// 사용자 login 정보 입력값 받기
const loginUser = ref({
  email: "",
  password: "",
});

// 사용자 email, password 정보를 입력하지 않은 경우 처리
const emailErrMsg = ref("");
const passwordErrMsg = ref("");
watch(() => loginUser.value.email,
  (value) => {
    let len = value.length;
    if (len == 0) {
      emailErrMsg.value = "아이디를 입력해주세요.";
    } else {
      emailErrMsg.value = "";
    }
  },
  { immediate: true }
);
watch(() => loginUser.value.password,
  (value) => {
    let len = value.length;
    if (len == 0) {
      passwordErrMsg.value = "비밀번호를 입력해주세요.";
    } else {
      passwordErrMsg.value = "";
    }
  },
  { immediate: true }
);

// 사용자가 submit 버튼 클릭 시 실행
function onSubmit() {
  // 입력값이 다 들어왔는지 확인하기
  if(emailErrMsg.value){
    alert(emailErrMsg.value);
  } else if(passwordErrMsg.value) {
    alert(passwordErrMsg.value);
  } else {
    login(); // API호출 데이터 처리 후 router 이동
  }
}

// login api 호출
const login = async () => {
  await userLogin(loginUser.value);
  let token = sessionStorage.getItem("accessToken");
  console.log(token);
  if(isLogin && token) {
    getUserInfo(); // token 값으로 
    router.push("/");
  } else {
    alert("로그인 실패!");
  }
};

// 네이버 로그인 api 호출
// const naverLogin = async () => {
//   await authLogin();
// }

const naverLogin = () => {
  window.location.href=`/server/oauth2/authorization/naver?redirect_uri=http://localhost:5173/oauth/redirect`;
// window.open(`/server/oauth2/authorization/naver?redirect_uri=http://localhost:5173/oauth/redirect`);
}
</script>

<template>
  <div class="login">
    <h1 class="mb-3" style="font-weight: bold; font-size: 30px;">로그인</h1>
    <form @submit.prevent="onSubmit">
      <div class="mb-3">
        <input
          type="email"
          class="form-control form-control-lg"
          v-model="loginUser.email"
          placeholder="Email"
        />
      </div>
      <div class="mb-3">
        <input
          type="password"
          class="form-control form-control-lg"
          v-model="loginUser.password"
          placeholder="비밀번호"
        />
      </div>
      <!-- 아이디 저장 -->
      <!-- <div class="mb-3 form-check">
        <input type="checkbox" class="form-check-input" id="exampleCheck1" />
        <label class="form-check-label" for="exampleCheck1">Check me out</label>
      </div> -->
      <!-- <div class="mb-3">
        <a href="">아이디 찾기</a>
        |
        <a href="">비밀번호 찾기</a>
      </div> -->
      <button type="submit" class="btn btn-lg btn-custom mb-3">로그인</button>
      <!--<button type="button" class="btn btn-lg btn-custom-green mb-3">
        <a href="/server/oauth2/authorization/naver?redirect_uri=http://localhost:5173/oauth/redirect">
        <img
          src="@/assets/img/naver_login_btn.png"
          alt=""
          style="width: 24px; height: 24px; margin-bottom: 4px"
        />
          네이버로 시작하기</a>
      </button>-->
      <button type="button" class="btn btn-lg btn-custom-green mb-3" @click="naverLogin">
        <img
          src="@/assets/img/naver_login_btn.png"
          alt=""
          style="width: 24px; height: 24px; margin-bottom: 4px"
        />
          네이버로 시작하기
      </button>
    </form>
    <div class="join">
      아직 계정이 없으시나요?
      <router-link to="join" >가입하기</router-link>
    </div>
  </div>
</template>

<style scoped>
* {
  font-family: Orbit;
  /* font-weight: bold; */
  font-size: 18px;
}
.login {
  margin: 60px auto;
  width: 330px;
  text-align: center;
}
.form-control {
  width: 330px;
  border-width: 2px;
  border-color: #f2f4f6;
  background-color: #f2f4f6;
  border-radius: 20px;
}
.form-control:focus {
  border-color: #ff8F00;
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
    0 0 8px rgba(245, 165, 45, 0.6);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
    0 0 8px rgba(245, 165, 45, 0.6);
}
a {
  text-decoration: none;
  color: black;
  font-size: 14px;
}
.btn {
  border-radius: 20px;
  
  font-weight: bold;
}
.btn-custom {
  width: 330px;
  color: white;
  background: #132141;
}
.btn-custom:hover {
  background: #FF8F00;
  color: #132141;
}
.btn-custom-green {
  color: white;
  width: 330px;
  background: #3BC95A;
}
.btn-custom-green:hover {
  color: white;
  background: #048e59;
}
.join {
  font-size: 12px;
}

.join a {
  font-size: 12px;
  font-weight: bold;
  color: #C2185B;
}
</style>
