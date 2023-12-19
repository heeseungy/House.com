<script setup>
import { ref, watch } from 'vue';
import { useMemberStore } from '@/stores/member';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

const router = useRouter();

const memberStore = useMemberStore();
const {userJoin} = memberStore;
const {isCreate} = storeToRefs(memberStore);

// 사용자 회원가입 입력값 받기
const joinUser = ref({
  password: "",
  email: "",
  name: "",
  admin_password: "",
})
// 사용자 메세지
const msg_pass = ref('최소 6글자 이상 입력해주세요.');
const msg_rePass = ref('최소 6글자 이상 입력해주세요.');
const msg_admin = ref('관리자 비밀번호는 빈칸으로 제출하셔도 됩니다.');

// joinUser.value.password의 입력값이 6글자 이상 된다면 msg값 변경
const getPassword = () => joinUser.value.password;
watch(getPassword, async(newPass) => {
  if(newPass.length >= 6) {
    msg_pass.value = '6글자 이상 확인 완료!'
  }
})

// 사용자 비밀번호 재확인 하기
const re_password = ref('');
// 사용자 비밀번호 재확인이 변경되면 입력한 비밀번호와 같은지 확인하고 메세지 보내기
watch(re_password, async(newPass) => {
  if(newPass.length >= 6 && newPass !== joinUser.value.password) {
    msg_rePass.value = '입력하신 비밀번호가 다릅니다.'
    rePasswordErrMsg.value = "비밀번호를 다시 확인해주세요.";
  } else if(newPass == joinUser.value.password) {
    msg_rePass.value = '확인 완료!'
    rePasswordErrMsg.value = "";
  } else {
    msg_rePass.value = '최소 6글자 이상 입력해주세요.';
  }
})

// 사용자가 입력값을 다 입력했는지 확인
// 사용자 email, password 정보를 입력하지 않은 경우 처리
const emailErrMsg = ref("");
const passwordErrMsg = ref("");
const rePasswordErrMsg = ref("");
const nameErrMsg = ref("");
watch(() => joinUser.value.email,
  (value) => {
    let len = value.length;
    if (len == 0) {
      emailErrMsg.value = "이메일을 입력해주세요.";
    } else {
      emailErrMsg.value = "";
    }
  },
  { immediate: true }
);
watch(() => joinUser.value.password,
  (value) => {
    let len = value.length;
    if (len == 0 || len < 6) {
      passwordErrMsg.value = "비밀번호를 다시 입력해주세요.";
    } else {
      passwordErrMsg.value = "";
    }
  },
  { immediate: true }
);
watch(() => nameErrMsg,
(value)=> {
  let len = value.length;
  if(len == 0) {
    nameErrMsg.value = "이름을 입력해주세요.";
  } else nameErrMsg.value = "";
});
// 사용자가 submit 버튼을 눌렀을 때 실행
function onSubmit() {
  console.log(joinUser.value);
  // 입력값이 다 들어 왔는지 확인하기
  if(emailErrMsg.value) {
    alert(emailErrMsg.value);
  }else if(passwordErrMsg.value) {
    alert(passwordErrMsg.value);
  }else if(rePasswordErrMsg.value) {
    alert(rePasswordErrMsg.value);
  }else if(nameErrMsg.value){
    alert(nameErrMsg.value);
  }else {
    // API 호출 데이터 처리 후 router.replace로 이동 시키기 (회원가입, 뒤로가기 없음)
    join();
  }
}
const join = async () => {
  await userJoin(joinUser.value);
  if(isCreate) {  // 성공이라면 메인으로 이동
    alert("회원가입 완료! 로그인 해주세요.");
    router.replace("/");
  } else {
    alert("회원가입 실패!");
  }
}
</script>

<template>
  <div class="user_join">
    <h1 class="mb-3" style="font-weight: bold; font-size: 30px;">회원가입</h1>
    <form @submit.prevent="onSubmit">
      <div class="mb-3">
        <input
          type="email"
          class="form-control form-control-lg"
          v-model="joinUser.email"
          placeholder="Email"
        />
      </div>
      <div class="mb-3">
        <input
          type="text"
          class="form-control form-control-lg"
          v-model="joinUser.name"
          placeholder="Name"
        />
      </div>
      <div class="mb-3">
        <input
          type="password"
          class="form-control form-control-lg"
          v-model="joinUser.password"
          placeholder="비밀번호"
        />
        <div class="msg">{{ msg_pass }}</div>
      </div>
      <div class="mb-3">
        <input
          type="password"
          class="form-control form-control-lg"
          v-model="re_password"
          placeholder="비밀번호 재확인"
        />
        <div class="msg">{{ msg_rePass }}</div>
      </div>
      <div class="mb-3">
        <input
          type="password"
          class="form-control form-control-lg"
          v-model="joinUser.admin_password"
          placeholder="관리자 비밀번호"
        />
        <div class="msg">{{msg_admin}}</div>
      </div>
      <!-- 아이디 저장 -->
      <!-- <div class="mb-3 form-check">
        <input type="checkbox" class="form-check-input" id="exampleCheck1" />
        <label class="form-check-label" for="exampleCheck1">Check me out</label>
      </div> -->

      <button type="submit" class="btn btn-lg btn-custom mb-3">회원가입</button>
    </form>
    <div class="login">
      이미 계정이 있으시나요?
      <router-link to="login" >로그인하기</router-link>
    </div>
  </div>
</template>

<style scoped>
.user_join {
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
.login {
  font-size: 12px;
}

.login a {
  text-decoration: none;
  font-size: 12px;
  font-weight: bold;
  color: #C2185B;
}

.msg {
  /* margin-left: 10px; */
  text-align: left;
  font-size: 12px;
  color: #aeaeae;
}
* {
  font-family: Orbit;
}
</style>
