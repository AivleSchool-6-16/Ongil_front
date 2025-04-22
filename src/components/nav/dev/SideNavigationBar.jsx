import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../../../styles/DevSideNavi.module.css';
import useNavigations from '../../Navigation/Navigations.jsx';
import { logout } from '../../ApiRoute/auth.jsx';

const DevSidenav = ({ className = '' }) => {
    const [selectedIndex, setSelectedIndex] = useState({ group: 'main', index: 0 });
    const [itemHeight, setItemHeight] = useState(60);
    const [itemMargin, setItemMargin] = useState(20);
    const [startPos, setStartPos] = useState(0);

    const location = useLocation();
    const navigate = useNavigate();
    const navigateTo = useNavigations();
    const containerRef = useRef(null);

    // 개발자 메뉴 목록
    const menuItems = [
        { id: 0, label: 'User',       icon: '/login-img.png',     path: '/dev/user' },
        { id: 1, label: 'Model',      icon: '/deep_learning.png', path: '/dev/model' },
        { id: 2, label: 'Network',    icon: '/global.png',        path: '/dev/network' },
        { id: 3, label: 'Dashboards', icon: '/dashboard.png',     path: '/dev/dashboard' },
        { id: 4, label: 'Back to App',icon: '/backarrow.png',     path: '/home',            isBack: true },
    ];

    // Layout 계산
    useEffect(() => {
        const updateLayout = () => {
            const root = getComputedStyle(document.documentElement);
            setItemHeight(parseInt(root.getPropertyValue('--item-height')) || 60);
            setItemMargin(parseInt(root.getPropertyValue('--item-margin')) || 20);
            if (containerRef.current) setStartPos(containerRef.current.offsetTop);
        };
        updateLayout();
        window.addEventListener('resize', updateLayout);
        return () => window.removeEventListener('resize', updateLayout);
    }, []);

    // 현재 경로 기반 선택 인덱스 설정
    useEffect(() => {
        const path = location.pathname;
        const idx = menuItems.findIndex(item => item.path === path);
        if (idx !== -1) {
            setSelectedIndex({ group: 'main', index: idx });
        }
    }, [location.pathname]);

    // 메뉴 클릭 처리
    const handleNavigation = (item) => {
        setSelectedIndex({ group: 'main', index: item.id });
        if (item.isBack) {
            navigate(item.path);
        } else {
            navigate(item.path);
        }
    };

    // 로그아웃 처리 (Back 옵션도 로그아웃 원하면 호출)
    const handleBack = async () => {
        // 로그아웃이 필요하면 아래 주석 제거
        // await logout(localStorage.getItem('access_token'));
        navigate('/home');
    };

    // 선택 표시 위치
    const calculateTop = () => startPos + selectedIndex.index * (itemHeight + itemMargin);

    return (
        <div className={[styles.devSidenav, className].join(' ')}>
            <div className={styles.leftNavi} />

            <div className={styles.menuItems} ref={containerRef}>
                {menuItems.map((item, idx) => (
                    <div
                        key={item.id}
                        className={`${styles.navItem} ${selectedIndex.index === idx ? styles.active : ''}`}
                        onClick={() => handleNavigation(item)}
                    >
                        <img src={item.icon} alt={item.label} />
                        <b>{item.label}</b>
                    </div>
                ))}
                <div
                    className={styles.selector1Icon}
                    style={{ top: `${calculateTop()}px` }}
                />
                <div
                    className={styles.selector2}
                    style={{ top: `${calculateTop()}px` }}
                />
            </div>
        </div>
    );
};

export default DevSidenav;
