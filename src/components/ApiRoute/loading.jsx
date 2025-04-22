// ApiRoute/loading.jsx
import { io } from "socket.io-client";

// 브라우저 환경에서는 localStorage에서 토큰을 가져올 수 있습니다.
const token = localStorage.getItem("access_token");

// 서버 주소와 필요한 옵션 설정 (서버 주소는 실제 환경에 맞게 수정)
const SERVER_URL = `${import.meta.env.VITE_SERVER_ROUTE}`;

const socket = io(SERVER_URL, {
    transports: ["websocket"], // WebSocket만 사용
    query: { token },           // Query parameter로 토큰 전송
});

export default socket;
