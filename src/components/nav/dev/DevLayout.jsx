// Layout.jsx
import "react";
import SideNavigation from "./DevSideNav.jsx";
import DynamicHeader from "./DevDynamicHeader.jsx";
import {Outlet} from "react-router-dom";

const DevLayout = () => {
    return (
        <>
            <SideNavigation/>
            <DynamicHeader/>
            <Outlet/> {/* 자식 Route의 컴포넌트가 렌더링되는 위치 */}
        </>
    );
};

export default DevLayout;
