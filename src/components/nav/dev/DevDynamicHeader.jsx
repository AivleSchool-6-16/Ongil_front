// src/components/DevDynamicHeader.jsx
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from '../../../styles/DevDynamicHeader.module.css';
import devStyles from '../../../styles/DevSideNavi.module.css';

const headerData = [
    {
        paths: ['/dev/dashboard'],
        primary: 'Dashboards',
        secondary: 'Visits & Error Monitoring',
    },
    {
        paths: ['/dev/user'],
        primary: 'User Control Center',
        secondary: 'User Status Monitoring Center',
    },
    {
        paths: ['/dev/ai'],
        primary: 'Model',
        secondary: 'AI Monitoring Center',
    },
];

const DevDynamicHeader = () => {
    const { pathname } = useLocation();
    const [sideNavWidth, setSideNavWidth] = useState(0);

    // 1) 사이드바의 실제 너비를 측정
    useEffect(() => {
        const update = () => {
            const el = document.querySelector(`.${devStyles.leftNavi}`);
            if (el) {
                setSideNavWidth(el.getBoundingClientRect().width);
            }
        };
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    // 2) 헤더용 텍스트 결정
    const entry = headerData.find(item =>
        item.paths.some(path => pathname.startsWith(path))
    );
    const primary   = entry ? entry.primary : '페이지를 찾을 수 없습니다';
    const secondary = entry?.secondary;

    return (
        <div
            className={styles.head}
            style={{
                left:  `${sideNavWidth}px`,
                width: `calc(100% - ${sideNavWidth}px)`,
            }}
        >
            <div className={styles.header}>
                <b className={styles.dashboards}>{primary}</b>
                {secondary && (
                    <>
                        <br/>
                        <b className={styles.visitsError}>{secondary}</b>
                    </>
                )}
            </div>
        </div>
    );
};

export default DevDynamicHeader;
