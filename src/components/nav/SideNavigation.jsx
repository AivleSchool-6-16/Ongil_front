import {useState, useEffect, useRef} from 'react';
import {useLocation} from "react-router-dom";
import styles from '../../styles/Navigation.module.css';
import useNavigations from "../Navigation/Navigations.jsx";

const SideNavigation = () => {
  const [selectedIndex, setSelectedIndex] = useState({group: 'top', index: 0});
  const [itemHeight, setItemHeight] = useState(60); // 기본 높이
  const [itemMargin, setItemMargin] = useState(20); // 기본 간격
  const [topStart, setTopStart] = useState(0); // 상단 아이템의 시작 위치
  const [bottomStart, setBottomStart] = useState(0); // 하단 아이템의 시작 위치

  const topContainerRef = useRef(null);
  const bottomContainerRef = useRef(null);
  const navigateTo = useNavigations();
  const location = useLocation();

  const handleNavigation = (page) => {
    navigateTo(page); // 페이지 이동 실행
  };

  const topItems = [
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
      path: '/road-search'
    },
    {
      id: 2,
      label: '정보 게시판',
      page: 'BoardMain',
      icon: '/images/board_img.png',
      path: ['/board-main', '/board-create']
    },
    {
      id: 3,
      label: '파일 요청 승인',
      page: 'AdminPage',
      icon: '/images/admin_img.png',
      onlyOn: '/admin-page',
      path: '/admin-page'
    },
  ];

  const bottomItems = [
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
    {
      id: 6,
      label: '문의하기',
      page: 'Inquire',
      icon: '/images/help_img.png',
      path: '/inquire'
    },
  ];

  const currentPath = location.pathname.replace(/\/$/, ''); // 끝 슬래시 제거

  const renderTopItems = topItems.filter((item) => {
    if (item.onlyOn) {
      return currentPath === item.onlyOn.replace(/\/$/, ''); // 정확히 일치하는 경로만 필터링
    }
    return true;
  });

  const updateLayout = () => {
    const rootStyle = getComputedStyle(document.documentElement);

    // CSS 변수 값 가져오기
    setItemHeight(parseInt(rootStyle.getPropertyValue('--item-height')) || 60);
    setItemMargin(parseInt(rootStyle.getPropertyValue('--item-margin')) || 20);

    // topNavContainer와 bottomNavContainer의 위치 업데이트
    if (topContainerRef.current) {
      setTopStart(topContainerRef.current.offsetTop);
    }
    if (bottomContainerRef.current) {
      setBottomStart(bottomContainerRef.current.offsetTop);
    }
  };

  useEffect(() => {
    // 경로 변경 시 활성화된 아이템 설정
    const path = location.pathname;
    const topIndex = topItems.findIndex(item => item.path === path);
    const bottomIndex = bottomItems.findIndex(item => item.path === path);

    if (topIndex !== -1) {
      setSelectedIndex({group: 'top', index: topIndex});
    } else if (bottomIndex !== -1) {
      setSelectedIndex({group: 'bottom', index: bottomIndex});
    }
  }, [location.pathname]);

  useEffect(() => {
    updateLayout(); // 초기 레이아웃 설정
    window.addEventListener('resize', updateLayout); // 화면 크기 변경에 대응

    return () => {
      window.removeEventListener('resize', updateLayout); // 이벤트 리스너 정리
    };
  }, []);

  const calculateTop = () => {
    const totalItemHeight = itemHeight + itemMargin;

    if (selectedIndex.group === 'top') {
      return topStart + selectedIndex.index * totalItemHeight;
    } else {
      return bottomStart + selectedIndex.index * totalItemHeight;
    }
  };

  return (
      <div className={styles.leftNavi}>
        {/* 선택된 아이템 표시 */}
        <div className={styles.selector1Icon}
             style={{top: `${calculateTop()}px`}}/>
        <div className={styles.selector2} style={{top: `${calculateTop()}px`}}/>

        {/* 상단 아이템 */}
        <div className={styles.menuItems} ref={topContainerRef}>
          {renderTopItems.map((item, index) => (
              <div
                  key={item.id}
                  className={`${styles.navItem} ${selectedIndex.group === 'top'
                  && selectedIndex.index === index ? styles.active : ''}`}
                  onClick={() => {
                    setSelectedIndex({group: 'top', index});
                    handleNavigation(item.page);
                  }}
              >
                <img src={item.icon} alt={item.label}/>
                <b>{item.label}</b>
              </div>
          ))}
        </div>

        {/* 하단 아이템 */}
        <div className={styles.bottomNavContainer} ref={bottomContainerRef}>
          {bottomItems.map((item, index) => (
              <div
                  key={item.id}
                  className={`${styles.navItem} ${selectedIndex.group
                  === 'bottom' && selectedIndex.index === index ? styles.active
                      : ''}`}
                  onClick={() => {
                    setSelectedIndex({group: 'bottom', index});
                    handleNavigation(item.page);
                  }}
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