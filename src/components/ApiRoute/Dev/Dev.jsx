// devApi.js (JS 전용)
import axios from "axios";

// axios 인스턴스
const devApi = axios.create({
    baseURL: `${import.meta.env.VITE_SERVER_ROUTE}/dev`,
    headers: {
        "Content-Type": "application/json",
    },
});

devApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers["token"] = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 사용자 목록 불러오기 (no TypeScript)
export const fetchDevUsers = async () => {
    try {
        const response = await devApi.get("/users");
        return response.data;
    } catch (error) {
        console.error("유저 목록 요청 실패", error);
        throw new Error("사용자 목록을 가져오는 데 실패했습니다.");
    }
};
