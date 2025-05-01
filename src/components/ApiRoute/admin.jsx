import axios from 'axios';

// axios 설정
const api = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_ROUTE}/admin`, // 기본 URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 설정 (토큰 자동 추가)
api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('access_token'); // 토큰 가져오기
      if (token) {
        config.headers['token'] = token; // 'Authorization'이 아니라 'token' 사용
      }
      return config;
    },
    (error) => Promise.reject(error)
);

// 파일 요청 목록 가져오기
export const fetchFileRequests = async () => {
  try {
    const response = await api.get('/file-requests'); // 인터셉터에서 자동으로 토큰 추가됨
    return response.data;
  } catch (error) {
    throw new Error("파일 요청 목록을 가져오는 데 실패했습니다.");
  }
};

// 파일 요청 승인
export const approveFileRequest = async (logId) => {
  try {
    const response = await api.post(`/file-requests/approve/${logId}`);
    return response.data;
  } catch (error) {
    throw new Error("파일 요청 승인에 실패했습니다.");
  }
};

// 파일 요청 거부
export const rejectFileRequest = async (logId) => {
  try {
    const response = await api.post(`/file-requests/reject/${logId}`);
    return response.data;
  } catch (error) {
    throw new Error("파일 요청 거부에 실패했습니다.");
  }
};
