import { createRouter, createWebHistory } from "vue-router";
import TheMainView from "@/views/TheMainView.vue";
import UserLogin from "@/components/user/UserLogin.vue";
import LoginNCallback from "@/components/user/LoginNCallback.vue";

// Notice (Board였던 것)
import TheNoticeView from "@/views/TheNoticeView.vue";
import NoticeList from "@/components/notice/NoticeList.vue";
import NoticeDetail from "@/components/notice/NoticeDetail.vue";
import NoticeRegist from "@/components/notice/NoticeRegist.vue";
import NoticeModify from "@/components/notice/NoticeModify.vue";

// House
import HouseContents from "@/views/house/HouseContents.vue";
import HouseFavorite from "@/views/house/HouseFavorite.vue";

// QnA
import TheQnaView from "@/views/TheQnaView.vue";
import QnAList from "@/components/qna/QnAList.vue";
import QnARegist from "@/components/qna/QnARegist.vue";

// MyPage
import TheMyView from "@/views/TheMyView.vue";
// 로그인 인증 사용자만 페이지 이동 가능 (header 인증 넣고 적용할 것)
import { storeToRefs } from "pinia";
import { useMemberStore } from "@/stores/member";

function expireCookie(name) {
  // 쿠키 문자열에서 해당 이름의 쿠키 찾기
  var cookieArray = document.cookie.split(';');
  for(var i = 0; i < cookieArray.length; i++) {
    var cookie = cookieArray[i];
    while (cookie.charAt(0) == ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name + "=") == 0) {
      // 쿠키 만료시키기
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      break;
    }
  }
}
function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
const ifAuthUser = async (to,from,next)=>{
  const memberStore = useMemberStore();
  const { userName, isLogin } = storeToRefs(memberStore);
  const { getUserInfo } = memberStore;
  let token = sessionStorage.getItem("accessToken");
  console.log("ifAuthUser");
  console.log(token);
  if(!token){
    token = getCookie("accessToken");
    console.log(token);
    if(token) {
      sessionStorage.setItem("accessToken",token);
      sessionStorage.setItem("refreshToken",getCookie("refreshToken"));
      expireCookie('accessToken');
      expireCookie('refreshToken');
      if (token) {
        await getUserInfo();
        isLogin.value = true;
      }
    }
  }
  next();
}
const onlyAuthUser = async (to, from, next) => {
  const memberStore = useMemberStore();
  const { userName, isValidToken } = storeToRefs(memberStore);
  const { getUserInfo } = memberStore;

  let token = sessionStorage.getItem("accessToken");

  if (userName.value != null && token) {
    await getUserInfo();
  }
  if (userName.value === null) {
    next({ name: "login" });
  } else {
    next();
  }
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "main",
      beforeEnter:ifAuthUser,
      component: TheMainView,
    },
    {
      path: "/login",
      name: "login",
      component: UserLogin,
    },
    {
      path: "/oauth/redirect",
      component: LoginNCallback,
    },
    {
      path: "/join",
      name: "join",
      component: () => import("@/components/user/UserJoin.vue"),
    },
    // notice (board였던것)
    {
      path: "/notice",
      name: "notice",
      component: TheNoticeView,
      redirect: "/notice/list",
      children: [
        {
          path: "list",
          name: "noticeList",
          component: NoticeList,
        },
        {
          path: "detail/:noticeId", // : 항목 id 필요
          name: "noticeDetail",
          component: NoticeDetail,
        },
        {
          path: "modify/:noticeId", // : 항목 id 필요
          name: "noticeModify",
          // beforeEnter: onlyAuthUser, // 로그인된 사용자만 페이지 이동 가능
          component: NoticeModify,
        },
        {
          path: "regist",
          name: "noticeRegist",
          // beforeEnter: onlyAuthUser, // 로그인된 사용자만 페이지 이동 가능
          component: NoticeRegist,
        },
      ],
    },
    // House
    {
      path: "/house/contents",
      name: "HouseContents",
      component: HouseContents,
    },
    {
      path: "/house/favorite",
      name: "HouseFavorite",
      // beforeEnter: onlyAuthUser, // 로그인된 사용자만 페이지 이동 가능
      component: HouseFavorite,
    },
    // Mypage
    {
      path: "/user/mypage",
      name: "mypage",
      beforeEnter: onlyAuthUser, // 로그인된 사용자만 페이지 이동 가능
      component: TheMyView,
    },
    // QnA
    {
      path: "/question",
      name: "question",
      component: TheQnaView,
      redirect: "/question/list",
      children: [
        {
          path: "list",
          name: "questionList",
          component: QnAList,
        },
        {
          path: "regist",
          name: "qnaRegist",
          // beforeEnter: onlyAuthUser, // 로그인된 사용자만 페이지 이동 가능
          component: QnARegist,
        },
      ],
    },
  ],
});

export default router;
