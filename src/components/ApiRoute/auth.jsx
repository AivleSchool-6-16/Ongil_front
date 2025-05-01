// src/components/ApiRoute/auth.jsx

import axios from 'axios';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: `${window.__CONFIG__.env.VITE_SERVER_ROUTE}/auth`, // FastAPI 서버의 기본 URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 설정 (토큰 자동 추가)
api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
);

// 1. 이메일 중복 및 형식 확인
export const checkEmail = async (email) => {
  try {
    const response = await api.post('/signup/check-email', {email});
    return response.data;
  } catch (error) {
    // 서버에서 보내주는 오류 메시지를 반환
    const errorMessage = error.response?.data?.detail || error.message
        || '이메일 확인 중 오류가 발생했습니다.';
    throw new Error(errorMessage);
  }
};

// 2. 회원가입 인증 이메일 전송 (전체 회원가입 데이터를 전송)
export const sendSignupCode = async (signupData) => {
  try {
    const response = await api.post('/signup/send-code', signupData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message
        || '인증 코드 전송 중 오류가 발생했습니다.';
    throw new Error(errorMessage);
  }
};

// 3. 이메일 인증 확인 (인증 토큰을 query parameter로 전송)
export const confirmEmail = async (token) => {
  try {
    const response = await api.get('/signup/confirm', {params: {token}});
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message
        || '이메일 인증 중 오류가 발생했습니다.';
    throw new Error(errorMessage);
  }
};

// 4. 회원가입 완료 (서버에서 해당 엔드포인트를 사용하지 않는다면 삭제하거나 추후 사용)
export const completeSignup = async (signupData) => {
  try {
    const response = await api.post('/signup/complete', signupData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message
        || '회원가입 완료 중 오류가 발생했습니다.';
    throw new Error(errorMessage);
  }
};

// 5. 로그인
export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/login', {email, password});
    // 토큰 저장
    localStorage.setItem('access_token', response.data.access_token);
    console.log(response.data.access_token);
    localStorage.setItem('refresh_token', response.data.refresh_token);
    localStorage.setItem('is_admin', response.data.is_admin);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message
        || '로그인 중 오류가 발생했습니다.';
    throw new Error(errorMessage);
  }
};

// 6. 로그아웃
export const logout = async (token) => {
  try {
    const response = await api.post('/logout', {token});
    // 로컬 저장소에서 토큰 제거
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('is_admin');
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message
        || '로그아웃 중 오류가 발생했습니다.';
    throw new Error(errorMessage);
  }
};

// 7. Refresh Token으로 Access Token 요청
export const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    const response = await api.post('/refresh', {refresh_token: refreshToken});
    // 새로운 Access Token 저장
    localStorage.setItem('access_token', response.data.access_token);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message
        || '토큰 갱신 중 오류가 발생했습니다.';
    throw new Error(errorMessage);
  }
};

// 8. 보호된 라우트 접근
export const getProtectedData = async () => {
  try {
    const response = await api.get('/protected');
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message
        || '보호된 데이터 가져오기 중 오류가 발생했습니다.';
    throw new Error(errorMessage);
  }
};

// 9. 비밀번호 찾기 (인증번호 발송)
export const findPassword = async (email) => {
  try {
    const response = await api.post('/findpwd', {email});
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message
        || '비밀번호 찾기 요청 중 오류가 발생했습니다.';
    throw new Error(errorMessage);
  }
};

// 10. 비밀번호 인증 코드 확인
export const verifyCode = async (email, code) => {
  try {
    const response = await api.post('/verify-code', {email, code});
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message
        || '인증 코드 확인 중 오류가 발생했습니다.';
    throw new Error(errorMessage);
  }
};

// 11. 비밀번호 재설정
export const resetPassword = async (resetData) => {
  try {
    const response = await api.post('/reset-password', resetData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message
        || '비밀번호 재설정 중 오류가 발생했습니다.';
    throw new Error(errorMessage);
  }
};

export default {
  checkEmail,
  sendSignupCode,
  confirmEmail,
  completeSignup,
  loginUser,
  logout,
  refreshAccessToken,
  getProtectedData,
  findPassword,
  verifyCode,
  resetPassword,
};
