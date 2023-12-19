// axios 설정 파일
import axios from "axios";
import { useRouter } from "vue-router";

function localAxios() {
  const instance = axios.create({
    baseURL: "/server",
    // headers: {
    //   "Content-Type": "application/json;charset=utf-8",
    // },
  });
  // Request 발생 시 적용할 내용.
  instance.defaults.headers.common["Authorization"] =
    "Bearer " + sessionStorage.getItem("accessToken");
  instance.defaults.headers.post["Content-Type"] = "application/json";
  instance.defaults.headers.put["Content-Type"] = "application/json";

  // Add a request interceptor - 요청 인터셉터
  instance.interceptors.request.use(
    function (config) {
      // 요청 날리기 전 세션에 accessToken이 존재하는지 확인
      const accessToken = sessionStorage.getItem("accessToken");

      if (accessToken) {
        // 존재한다면 headers에 실어서 보냄
        config.headers.Authorization = "Bearer " + accessToken;
        // config.headers["Access-Control-Allow-Origin"] = "*";
      }
      return config;
    },
    function (error) {
      // 토큰이 필요한 요청엔 에러 표시
      return Promise.reject(error);
    }
  );

  // Add a response interceptor - 응답 인터셉터
  instance.interceptors.response.use(
    function (response) {
      console.log(response);
      return response;
    },
    function (error) {
      console.log(error.response);
      const originalRequest = error.confing;
      const refreshToken = sessionStorage.getItem("refreshToken");
      const router = useRouter();

      // unAuthorized(401) status라면 refreshToken의 존재 여부에 따라 재요청 or 메인페이지 이동
      if (error.response.status === 401) {
        if (refreshToken) {
          // refreshToken이 존재한다면 재발급 요청
          return axios
            .get(`/server/user/refresh`)
            .then((res) => {
              // accessToken 발급에 성공하면 재발급 받은 token 저장 및 이전 요청 재요청
              sessionStorage.setItem(
                "accessToken",
                res.headers["authorization"]
              );
              originalRequest.headers.Authorization =
                "Bearer " + `${res.headers["authorization"]}`;
              return instance(originalRequest);
            })
            .catch((error) => {
              // refreshToken이 만료됐다면, accessToken 발급 실패
              // 재로그인 요청 및 메인페이지로 리다이렉트
              alert("다시 로그인해주세요.");
              router.push("/");
              return Promise.reject(error);
            });
        } else {
          // refreshToken이 존재하지 않다면 메인페이지로 리다이렉트
          router.push("/");
        }
      }
    }
  );

  return instance;
}

export { localAxios };
