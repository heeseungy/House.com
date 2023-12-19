// Vue Pinia를 사용한 상태 관리 파일
import { ref } from "vue";
import { defineStore } from "pinia";
// import { useRouter } from "vue-router";

import {
  userConfirm,
  naverAuth,
  userSingUp,
  findByUser,
  userUpdate,
  userDelete,
} from "@/api/user";

export const useMemberStore = defineStore(
  "memberStore",
  () => {
    // const router = useRouter();

    // 로그인 상태관리
    const isLogin = ref(false);
    const isLoginError = ref(false);
    const isValidToken = ref(false);
    const userInfo = ref({});
    const userName = ref("");
    const isAdmin = ref(false);
    const userEmail = ref("");
    // 회원가입 상태관리
    const isCreate = ref(false);
    // 회원수정 상태관리
    const isUpdate = ref(false);
    // 회원탈퇴 상태관리
    const isDelete = ref(false);

    // 쿠키에서 토큰을 읽는 함수
    function getCookie(name) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }
    // 로그인 상태 확인 함수
    const checkLoginStatus = () => {
        let token = getCookie('accessToken');
        if (token) {
            isLogin.value = true;
            isValidToken.value = true;
        } else {
            isLogin.value = false;
            isValidToken.value = false;
        }
    };

    // 로그인 api 호출
    const userLogin = async (loginUser) => {
      await userConfirm(
        loginUser,
        (response) => {
          if (response.status === 200) {
            // Bearer {token}, Bearer 제외한 token값만 받음
            let accessToken = response.headers["authorization"].split(" ")[1];
            let refreshToken = response.headers["refresh_token"].split(" ")[1];
            isLogin.value = true;
            isLoginError.value = false;
            isValidToken.value = true;
            sessionStorage.setItem("accessToken", accessToken);
            sessionStorage.setItem("refreshToken", refreshToken);
            // let decodeToken = jwtDecode(accessToken);
            // console.log(decodeToken.role);  // DDUBEOKY
          } else {
            isLogin.value = false;
            isLoginError.value = true;
            isValidToken.value = false;
          }
        },
        (error) => {
          console.log(error);
        }
      );
    };

    // 네이버 로그인 api 호출
    const authLogin = async () => {
      await naverAuth();
    };

    // 회원가입 api 호출
    const userJoin = async (joinUser) => {
      await userSingUp(
        joinUser,
        (response) => {
          if (response.status == 200) {
            console.log("회원가입 완료");
            isCreate.value = true;
          } else {
            console.log("회원가입 실패");
            isCreate.value = false;
          }
        },
        (error) => {
          console.log(error);
          return error;
        }
      );
    };
    // 사용자 정보 api 호출
    const getUserInfo = async () => {
      await findByUser(
        (response) => {
          if (response.status === 200) {
            console.log(response.data.data_body);
            userInfo.value = response.data.data_body;
            // userInfo.value = {
            //   email: response.data.email,
            //   name: response.data.name,
            //   password: response.data.password,
            // };
            // console.log(userInfo.value);
              isLogin.value = true;
            userName.value = response.data.data_body.name;
            userEmail.value = response.data.data_body.email;
            if (response.data.data_body.role === "DDUBEOKY") {
              isAdmin.value = false;
            } else {
              isAdmin.value = true;
            }
          } else {
            console.log("사용자 없음");
          }
        },
        async (error) => {
          console.log(error);
          isValidToken.value = false;
        }
      );
      return userInfo;
    };

    // 사용자 회원 정보 수정 api 호출
    const userTryUpdate = async (req) => {
      await userUpdate(req, (response) => {
        if (response.status === 200) {
          console.log("회원 정보 수정 완료!");
          isUpdate.value = true;
        } else {
          console.log("회원 정보 수정 실패...");
          isUpdate.value = false;
        }
      });
    };

    // 사용자 탈퇴 api 호출
    const userTryDelete = async () => {
      await userDelete((response) => {
        if (response.status === 200) {
          console.log("회원탈퇴 완료");
          isDelete.value = true;
        } else {
          console.log("회원탈퇴 실패");
          isDelete.value = false;
        }
      });
    };

    return {
      isLogin,
      isLoginError,
      isValidToken,
      isCreate,
      isUpdate,
      isDelete,
      isAdmin,
      userEmail,
      userLogin,
      authLogin,
      userJoin,
      getUserInfo,
      userTryUpdate,
      userTryDelete,
      userInfo,
      userName,
      checkLoginStatus,
    };
  },
  {
    persist: {
      paths: ["isLogin", "isValidToken", "userName", "isAdmin", "userEmail"],
    },
  }
);
