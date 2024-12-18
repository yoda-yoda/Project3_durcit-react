import axios from "axios";

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: "http://localhost:8080/api/members", // API의 기본 URL
  timeout: 10000, // 요청 타임아웃 설정 (10초)
});

// 요청 인터셉터: 토큰 추가
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    if (refreshToken) {
      config.headers.RefreshToken = refreshToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 필요 시 추가 처리 가능
apiClient.interceptors.response.use(
  (response) => {
    // 응답 성공 시 처리
    return response;
  },
  (error) => {
    // 응답 오류 시 처리
    if (error.response && error.response.status === 401) {
      // 인증 실패 처리 (예: 토큰 만료 시 로그아웃 또는 갱신 로직 추가)
      console.error("Authentication failed. Please login again.");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
