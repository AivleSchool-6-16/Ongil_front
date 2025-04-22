import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from '../../../styles/DevDynamicHeader.module.css';

const DevDynamicHeader = ({ className = '' }) => {
    const location = useLocation();
    const [sideNavWidth, setSideNavWidth] = useState(290);

    const role = localStorage.getItem('is_admin');
    const isAdmin = role === '1';
    const isDev = role === '2';

    // 개발자 전용 헤더 데이터
    const headerData = [
        {
            paths: ['/dev/user'],
            icon: '/images/user-monitor-icon.png',
            text: 'User Status Monitoring Center',
        },
        // 추가적인 개발자 페이지 경로와 텍스트/아이콘을 여기에 정의하세요
    ];

    // 현재 경로에 맞는 헤더 선택
    let currentHeader = headerData.find(entry =>
        entry.paths.some(path => location.pathname.startsWith(path))
    );

    // 권한 접두어
    if (isDev && currentHeader) {
        if (!currentHeader.text.startsWith('[개발자]')) {
            currentHeader = { ...currentHeader, text: `[개발자] ${currentHeader.text}` };
        }
    }
    if (isAdmin && currentHeader) {
        if (!currentHeader.text.startsWith('[관리자]')) {
            currentHeader = { ...currentHeader, text: `[관리자] ${currentHeader.text}` };
        }
    }

    // fallback
    if (!currentHeader) {
        currentHeader = {
            icon: '/images/default-icon.png',
            text: '페이지를 찾을 수 없습니다',
        };
    }

    // 사이드바 너비 반응형 업데이트
    useEffect(() => {
        let timeoutId;
        const updateWidth = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                const rootStyle = getComputedStyle(document.documentElement);
                const width = parseInt(rootStyle.getPropertyValue('--side-nav-width')) || 290;
                setSideNavWidth(width);
            }, 150);
        };
        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', updateWidth);
        };
    }, []);

    return (
        <div
            className={[styles.userHeader, className].join(' ')}
            style={{
                left: `${sideNavWidth}px`,
                width: `calc(100% - ${sideNavWidth}px)`,
            }}
        >
            <div className={styles.userControlCenterParent}>
                <img
                    className={styles.headerIcon}
                    loading="lazy"
                    alt=""
                    src={currentHeader.icon}
                />
                <b className={styles.userControlCenter}>{currentHeader.text}</b>
            </div>

                <div className={styles.searchSeparator} />
                <div className={styles.userSearchSortContainer}>
                    <h2 className={styles.searchUserFor}>Search User for Email/Local</h2>

            </div>
        </div>
    );
};

DevDynamicHeader.propTypes = {
    className: PropTypes.string,
};

export default DevDynamicHeader;
