// src/routes/DevRoute.jsx
import { Navigate } from 'react-router-dom';
// eslint-disable-next-line react/prop-types
const DevRoute = ({ children }) => {
    const accessToken = localStorage.getItem('access_token');
    const role = localStorage.getItem('is_admin');

    // 토큰이 없으면 로그인 페이지로
    if (!accessToken) {
        return <Navigate to="/" replace={true}/>;
    }

    // 관리자 권한이 아니면 404나 403 페이지 등으로 안내
    if (!role) {
        return <Navigate to="/not-found" replace/>;
    }

    // 토큰+관리자 권한이 모두 있으면 해당 라우트 정상 렌더링
    return children;
};

export default DevRoute;
