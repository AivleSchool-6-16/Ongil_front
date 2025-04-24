// src/routes/DevRoute.jsx
import { Navigate } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
const DevRoute = ({ children }) => {
    const accessToken = localStorage.getItem('access_token');
    const role        = localStorage.getItem('is_admin');   // "2" (문자열) 로 저장돼 있다고 가정

    /* 1) 로그인 여부 확인 */
    if (!accessToken) return <Navigate to="/" replace />;

    /* 2) 관리자 권한: 값이 "2"일 때만 통과 */
    if (role !== "2") return <Navigate to="/not-found" replace />;

    /* 3) 조건 통과 → 대상 컴포넌트 렌더링 */
    return children;
};

export default DevRoute;
