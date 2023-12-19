<script setup>
import { ref, watch, onMounted } from "vue";
import { useMemberStore } from "@/stores/member";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

const router = useRouter();

const memberStore = useMemberStore();
const { getUserInfo, userTryUpdate, userTryDelete } = memberStore;
const { userInfo, isUpdate, isDelete, userName } = storeToRefs(memberStore);
const isDataLoaded = ref(false);
const name = ref("");
const pass = ref("");
const rePass = ref("");
onMounted(async () => {
  try {
    await getUserInfo();
    name.value = userInfo.value.name;
    pass.value = userInfo.value.password;

    isDataLoaded.value = true;
  } catch (error) {
    console.error("Error fetching user info:", error);
  }
});

// 사용자 메세지
const msg_pass = ref("최소 6글자 이상 입력해주세요.");
const msg_rePass = ref("최소 6글자 이상 입력해주세요.");

// pass의 입력값이 6글자 이상 된다면 msg값 변경
const getPassword = () => pass.value;
watch(getPassword, async (newPass) => {
  if (newPass.length >= 6) {
    msg_pass.value = "6글자 이상 확인 완료!";
  } else {
    msg_pass.value = "최소 6글자 이상 입력해주세요.";
  }
});

// 사용자가 입력값을 다 입력했는지 확인
// 사용자 name, password 정보를 입력하지 않은 경우 처리
const passwordErrMsg = ref("");
const rePasswordErrMsg = ref("비밀번호를 재확인해주세요.");
const nameErrMsg = ref("");
watch(
  () => pass.value,
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
watch(
  () => name.value,
  (value) => {
    let len = value.length;
    if (len == 0) {
      nameErrMsg.value = "이름을 입력해주세요.";
    } else nameErrMsg.value = "";
  }
);
// 사용자 비밀번호 수정 재확인 하기
// 사용자 비밀번호 재확인이 변경되면 입력한 비밀번호와 같은지 확인하고 메세지 보내기
watch(rePass, async (newPass) => {
  if (newPass.length >= 6 && newPass !== pass.value) {
    msg_rePass.value = "입력하신 비밀번호가 다릅니다.";
    rePasswordErrMsg.value = "비밀번호를 다시 확인해주세요.";
  } else if (newPass == pass.value) {
    msg_rePass.value = "확인 완료!";
    rePasswordErrMsg.value = "";
  } else {
    msg_rePass.value = "최소 6글자 이상 입력해주세요.";
  }
});

// 사용자가 submit 버튼을 눌렀을 때 실행
function onSubmit() {
  console.log(name.value, pass.value, rePasswordErrMsg.value);
  // 입력값이 다 들어 왔는지 확인하기
  if (passwordErrMsg.value) {
    alert(passwordErrMsg.value);
  } else if (rePasswordErrMsg.value) {
    alert(rePasswordErrMsg.value);
  } else if (nameErrMsg.value) {
    alert(nameErrMsg.value);
  } else {
    console.log(name.value, pass.value);
    update();
  }
}

// 회원 정보 수정 api 호출
const update = async () => {
  let token = sessionStorage.getItem("accessToken");
  await userTryUpdate({ name: name.value, password: pass.value }, token);
  if (isUpdate) {
    userName.value = name.value;
    alert("회원 정보 수정 완료!");
  } else {
    alert("회원 정보 수정 실패!");
  }
};

// 사용자가 탈퇴 버튼을 눌렀을 때 실행 (SQL ERROR!)
const userDeleteBtn = async () => {
  await userTryDelete();
  if (isDelete) {
    // 성공이라면 메인으로 이동
    alert("회원 정보 탈퇴 완료!");
    router.replace("/");
  } else {
    alert("회원 정보 탈퇴 실패!");
  }
};
</script>

<template>
  <div v-if="isDataLoaded" class="user_modify">
    <h1 class="mb-3">내 정보</h1>
    <form @submit.prevent="onSubmit">
      <div class="mb-3">
        <input
          type="email"
          class="form-control form-control-lg"
          v-model="userInfo.email"
          placeholder="Email"
          disabled
        />
      </div>
      <div class="mb-3">
        <input
          type="text"
          class="form-control form-control-lg"
          v-model="name"
          placeholder="Name"
        />
      </div>
      <div v-if="pass !== null">
        <div class="mb-3">
          <input
            type="password"
            class="form-control form-control-lg"
            v-model="pass"
            placeholder="비밀번호"
          />
          <div class="msg">{{ msg_pass }}</div>
        </div>
        <div class="mb-3">
          <input
            type="password"
            class="form-control form-control-lg"
            v-model="rePass"
            placeholder="비밀번호 재확인"
          />
          <div class="msg">{{ msg_rePass }}</div>
        </div>
      </div>

      <div class="buttons">
        <button type="button" class="deleteButton" @click="userDeleteBtn">
          계정 탈퇴
        </button>
        <button type="submit" class="btn btn-lg btn-custom mb-3">
          정보 수정
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.user_modify {
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
  border-color: #ff8f00;
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
  width: 200px;
  color: white;
  background: #132141;
}
.btn-custom:hover {
  background: #ff8f00;
  color: #132141;
}
.buttons {
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.deleteButton {
  text-decoration: none;
  font-size: 12px;
  border: 0;
  background-color: transparent;
}

.deleteButton:hover {
  color: #c2185b;
}

.msg {
  /* margin-left: 10px; */
  text-align: left;
  font-size: 12px;
  color: #aeaeae;
}
</style>
