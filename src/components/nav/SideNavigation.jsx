// src/components/SideNavigation.jsx
import {useState, useEffect, useRef, useMemo} from 'react';
import {useLocation} from 'react-router-dom';
import styles from '../../styles/Navigation.module.css';
import useNavigations from '../Navigation/Navigations.jsx';
import {logout} from '../ApiRoute/auth.jsx';

const SideNavigation = () => {
  /* ───── 권한 정보 ───── */
  const role = localStorage.getItem('is_admin'); // "1" | "2" | null
  const isAdmin = role === '1';
  const isDev = role === '2';

  /* ───── 메뉴 정의 ───── */
  const TOP_ITEMS = [
    {
      id: 0,
      label: '대시보드',
      page: 'Home',
      icon: '/images/home_img.png',
      path: '/home'
    },
    {
      id: 1,
      label: '열선 도로 추천',
      page: 'RoadsSearch',
      icon: '/images/road_img.png',
      path: ['/roads-search', '/roads-recommend']
    },
    {
      id: 2,
      label: '정보 게시판',
      page: 'BoardMain',
      icon: '/images/board_img.png',
      path: ['/board-main', '/board-create', '/board-detail']
    },
    {
      id: 3,
      label: '파일 요청 승인',
      page: 'AdminPage',
      icon: '/images/admin_img.png',
      path: '/admin-page',
      isAdminItem: true
    },
    {
      id: 6,
      label: '개발자 페이지',
      page: 'DevDashboard',
      icon: '/images/dev.png',
      path: '/dev',
      isDevItem: true
    },
  ];
  const BOTTOM_ITEMS = [
    {
      id: 4,
      label: '마이페이지',
      page: 'Mypage',
      icon: '/images/login_img.png',
      path: '/mypage'
    },
    {
      id: 5,
      label: '로그아웃',
      page: 'Login',
      icon: '/images/sign-out_img.png',
      path: '/'
    },
  ];

  /* ───── 상태 ───── */
  const [selectedIndex, setSelectedIndex] = useState({group: 'top', index: 0});
  const [itemHeight, setItemHeight] = useState(60);
  const [itemMargin, setItemMargin] = useState(20);
  const [topStart, setTopStart] = useState(0);
  const [bottomStart, setBottomStart] = useState(0);

  /* ───── 훅 ───── */
  const navigateTo = useNavigations();
  const location = useLocation();
  const topContainerRef = useRef(null);
  const bottomContainerRef = useRef(null);

  /* ───── 권한으로 top 메뉴 필터 ───── */
  const visibleTopItems = useMemo(() => (
      TOP_ITEMS.filter(i => {
        if (i.isAdminItem) {
          return isAdmin;
        }
        if (i.isDevItem) {
          return isDev;
        }
        return true;
      })
  ), [isAdmin, isDev]);

  /* ───── 경로 매칭 util ───── */
  const matchPath = (itemPath, current) => (
      Array.isArray(itemPath)
          ? itemPath.some(p => current.startsWith(p))
          : current.startsWith(itemPath)
  );

  /* ───── URL 변동 → selector 동기화 ───── */
  useEffect(() => {
    const cur = location.pathname.replace(/\/$/, '');
    const tIdx = visibleTopItems.findIndex(i => matchPath(i.path, cur));
    const bIdx = BOTTOM_ITEMS.findIndex(i => matchPath(i.path, cur));

    if (tIdx !== -1) {
      setSelectedIndex({group: 'top', index: tIdx});
    } else if (bIdx !== -1) {
      setSelectedIndex({group: 'bottom', index: bIdx});
    }
  }, [location.pathname, visibleTopItems]);

  /* ───── CSS 변수→레이아웃 동기화 ───── */
  const syncLayout = () => {
    const css = getComputedStyle(document.documentElement);
    setItemHeight(+css.getPropertyValue('--item-height') || 60);
    setItemMargin(+css.getPropertyValue('--item-margin') || 20);
    if (topContainerRef.current) {
      setTopStart(topContainerRef.current.offsetTop);
    }
    if (bottomContainerRef.current) {
      setBottomStart(
          bottomContainerRef.current.offsetTop);
    }
  };
  useEffect(() => {
    syncLayout();
    window.addEventListener('resize', syncLayout);
    return () => window.removeEventListener('resize', syncLayout);
  }, []);

  /* ───── 네비게이션 & 로그아웃 ───── */
  const handleClick = (group, idx, item) => {
    setSelectedIndex({group, index: idx});
    if (item.label === '로그아웃') {
      return handleLogout();
    }
    navigateTo(item.page);
  };
  const handleLogout = async () => {
    // 1) 토큰·역할 정보 제거
    ['access_token', 'refresh_token', 'is_admin'].forEach(
        key => localStorage.removeItem(key)   // ✔️ this 유지
    );

    // 2) 라우팅 (토큰 삭제가 끝난 뒤 바로 이동)
    navigateTo('Login');     // 또는 navigate('/'); 등 실제 로그인 경로

    // 3) 서버에도 로그아웃 알리기
    try {
      const accessToken = localStorage.getItem('access_token_backup'); // → 삭제 전에 따로 저장해둔 값
      await logout(accessToken);
    } catch (err) {
      console.warn('서버 로그아웃 실패 (무시 가능):', err.message);
    }
  };

  /* ───── selector 위치 계산 ───── */
  const selectorTop =
      (selectedIndex.group === 'top' ? topStart : bottomStart) +
      selectedIndex.index * (itemHeight + itemMargin);

  /* ───── 렌더 ───── */
  return (
      <div className={styles.leftNavi}>
        {/* selector bar */}
        <div className={styles.selector1Icon} style={{top: selectorTop}}/>
        <div className={styles.selector2} style={{top: selectorTop}}/>

        {/* top menu */}
        <div className={styles.menuItems} ref={topContainerRef}>
          {visibleTopItems.map((item, idx) => (
              <div
                  key={item.id}
                  className={`${styles.navItem}${selectedIndex.group === 'top'
                  && selectedIndex.index === idx ? ` ${styles.active}` : ''}`}
                  onClick={() => handleClick('top', idx, item)}
              >
                <img src={item.icon} alt={item.label}/>
                <b>{item.label}</b>
              </div>
          ))}
        </div>

        {/* bottom menu */}
        <div className={styles.bottomNavContainer} ref={bottomContainerRef}>
          {BOTTOM_ITEMS.map((item, idx) => (
              <div
                  key={item.id}
                  className={`${styles.navItem}${selectedIndex.group
                  === 'bottom' && selectedIndex.index === idx
                      ? ` ${styles.active}` : ''}`}
                  onClick={() => handleClick('bottom', idx, item)}
              >
                <img src={item.icon} alt={item.label}/>
                <b>{item.label}</b>
              </div>
          ))}
        </div>
      </div>
  );
};

export default SideNavigation;
