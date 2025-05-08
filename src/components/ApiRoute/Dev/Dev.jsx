/* ──────────────────────────────────────────────────────────────────
 * devApi.js  ―  개발자 대시보드 전용 Axios 래퍼 (Pure JS)
 *   · 공통 baseURL  :  <SERVER_ROUTE>/dev
 *   · 요청 인터셉터 : localStorage 의 access_token → header `token`
 *   · util 함수     : 사용자/AI 모니터링 관련 엔드포인트 래핑
 * ----------------------------------------------------------------*/

import axios from "axios";

/* ① 공통 base URL */
const BASE = import.meta.env.VITE_SERVER_ROUTE;

/* ② /dev 전용 Axios 인스턴스 */
const devApi = axios.create({
  baseURL: `${BASE}/dev`,
  headers: {"Content-Type": "application/json"}
});

/* ③ 토큰 자동 첨부 */
devApi.interceptors.request.use(
    config => {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers["token"] = token;
      }
      return config;
    },
    error => Promise.reject(error)
);

/* ───────── API helpers ───────── */

/* devApi.js – 일부 코드만 발췌 */

export const fetchDevUsers = () =>
    devApi.get("/users").then(res => res.data);        // 🔸 .data 반환

export const patchUserPermission = (email, newPermission) =>
    devApi.patch(`/users/${email}`, {new_permission: newPermission});

export const kickUser = email =>
    devApi.delete(`/users/${email}`);

export const fetchDevAiStats = () =>
    devApi.get("/status/ai-monitoring").then(res => res.data);    // 🔸

export const fetchAiLogs = (limit = 10) =>
    devApi.get(`/ai/logs?limit=${limit}`).then(res => res.data);   // 🔸

export const fetchRecentRecommCnt = (h = 24) =>
    devApi.get(`/status/recent-recommend?hours=${h}`).then(res => res.data); // 🔸

export const fetchRecLogs = () =>
    axios.get(`${BASE}/roads/recommendations/log`, {
      headers: {token: localStorage.getItem("access_token")}
    }).then(res => res.data);                                      // 🔸

