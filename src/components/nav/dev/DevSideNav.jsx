import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import useNavigations from '../../Navigation/Navigations.jsx';
import styles from '../../../styles/Navigation.module.css';      // 공통
import devStyles from '../../../styles/DevSideNavi.module.css';  // 추가 규칙

const DevSideNav = () => {
    /* ───────── state & ref ───────── */
    const [selectedIndex, setSelectedIndex] = useState({ group: 'main', index: 0 });
    const [itemHeight,   setItemHeight]   = useState(60);
    const [itemMargin,   setItemMargin]   = useState(20);
    const [containerTop, setContainerTop] = useState(0);

    const location     = useLocation();
    const navigateTo   = useNavigations();
    const containerRef = useRef(null);

    /* ───────── 메뉴 정의 ───────── */
    const menuItems = [
        { id: 0, label: 'Dashboards', page: 'DevDashboard', icon: '/images/dashboard.png', path: '/dev/dashboards'  },
        { id: 1, label: 'User',       page: 'DevUser',      icon: '/images/login_img.png', path: '/dev/user'       },
        { id: 2, label: 'Model',      page: 'DevAI',     icon: '/images/deep_learning.png', path: '/dev/ai'   },
        { id: 3, label: 'Network',    page: 'DevNetwork',   icon: '/images/global.png'          },
        { id: 4, label: 'Back to Home',page: 'Home',          icon: '/images/back_arrow.png', isBack: true },
    ];

    /* ───────── 레이아웃 계산 ───────── */
    const syncLayout = () => {
        const root = getComputedStyle(document.documentElement);
        setItemHeight(parseInt(root.getPropertyValue('--item-height')) || 60);
        setItemMargin(parseInt(root.getPropertyValue('--item-margin')) || 20);
        if (containerRef.current) setContainerTop(containerRef.current.offsetTop);
    };
    useEffect(() => {
        syncLayout();
        window.addEventListener('resize', syncLayout);
        return () => window.removeEventListener('resize', syncLayout);
    }, []);
    useEffect(() => {
        const idx = menuItems.findIndex(m =>
            location.pathname.startsWith(m.path)      // ← 서브 경로가 있어도 매칭
        );
        if (idx !== -1) setSelectedIndex({ group: 'main', index: idx });
    }, [location.pathname]);


    /* ───────── URL 변화 시 active 동기화 ───────── */
    useEffect(() => {
        const idx = menuItems.findIndex(m => m.page === location.pathname);
        if (idx !== -1) setSelectedIndex({ group: 'main', index: idx });
    }, [location.pathname]);

    /* ───────── 클릭 핸들러 ───────── */
    const handleClick = (item, idx) => {
        setSelectedIndex({ group: 'main', index: idx });
        navigateTo(item.page);
    };

    const selectorTop = containerTop + selectedIndex.index * (itemHeight + itemMargin);

    /* ───────── 렌더 ───────── */
    return (
        <div className={`${devStyles.leftNavi} ${devStyles.devLeftNavi}`}>
            {/* 로고 */}
            <div className={devStyles.logoArea}>
                <img src="/images/logo.png" alt="logo" className={devStyles.logoImg} />
            </div>

            {/* 메뉴 목록 */}
            <div className={styles.menuItems} ref={containerRef}>
                {menuItems.map((item, idx) => (
                    <div
                        key={item.id}
                        className={`${styles.navItem} ${selectedIndex.index === idx ? styles.active : ''}`}
                        onClick={() => handleClick(item, idx)}
                    >
                        <img src={item.icon} alt={item.label} />
                        <b>{item.label}</b>
                    </div>
                ))}
            </div>

            {/* 이동 표시 바 */}
            <div className={styles.selector1Icon} style={{ top: selectorTop }} />
            <div className={styles.selector2}    style={{ top: selectorTop }} />
        </div>
    );
};

export default DevSideNav;
