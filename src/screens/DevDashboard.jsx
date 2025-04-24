import React from "react";
import styles from "../styles/DevDashboard.module.css";

const stats = [
    {
        title: "New-Member",
        value: 4,
        unit: "People",
        img: "/images/new-member.png",
        barClass: styles.blueBar,
    },
    {
        title: "Real-Time",
        value: 4,
        unit: "People",
        img: "/images/real-time.png",
        barClass: styles.redBar,
    },
    {
        title: "Today-Visitor",
        value: 4,
        unit: "People",
        img: "/images/today_visitor.png",
        barClass: styles.orangeBar,
    },
    {
        title: "Today-Event",
        value: 4,
        unit: "Event",
        img: "/images/event.png",
        barClass: styles.yellowBar,
    },
];

export default function DevDashboard() {
    return (
        <div className={styles.devDashboard}>
            {/* ───────── 통계 카드 영역 ───────── */}
            <section className={styles.statWrapper}>
                {stats.map(({ title, value, unit, img, barClass }) => (
                    <article className={styles.statCard} key={title}>
                        <div className={`${styles.statBar} ${barClass}`} />
                        <img className={styles.statIcon} src={img} alt={title} />

                        <span className={styles.statValue}>{value}</span>
                        <span className={styles.statUnit}>{unit}</span>
                        <span className={styles.statTitle}>{title}</span>
                    </article>
                ))}
            </section>

            {/* ───────── 그래프 카드 영역 ───────── */}
            <section className={styles.graphWrapper}>
                <article className={styles.graphCard}>
                    <h3>신규 가입자 집계</h3>
                    {/* 👉 그래프 컴포넌트 삽입 */}
                </article>
                <article className={styles.graphCard}>
                    <h3>방문자 요약</h3>
                </article>
                <article className={styles.graphCard}>
                    <h3>에러 발생 지점</h3>
                </article>
                <article className={styles.graphCard}>
                    <h3>에러 발생 유형</h3>
                </article>
            </section>
        </div>
    );
}
