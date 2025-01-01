import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const NO_AUTH_BASE_URL = process.env.REACT_APP_NO_AUTH_BASE_URL;

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

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

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      alert("토큰이 만료되었습니다. 다시 로그인 해주세요.");
      localStorage.clear();
      console.error("Authentication failed. Please login again.");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

const apiClientNoAuth = axios.create({
  baseURL: NO_AUTH_BASE_URL,
  timeout: 10000,
});

apiClientNoAuth.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { apiClient, apiClientNoAuth };
