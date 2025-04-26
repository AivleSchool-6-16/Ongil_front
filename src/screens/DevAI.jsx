import React from "react";
import styles from "../styles/DevAI.module.css";

/* ───── 상단 통계 카드 데이터 ───── */
const stats = [
    {
        title: "Today-Predict",
        value: 4,
        unit: "Predict",
        img: "/images/today_predict.png",
        barClass: styles.orangeBar,
    },

];

export default function DevAi() {
    return (
        <div className={styles.devAi}>

            {/* ───── 통계 카드 ───── */}
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

            {/* ───── 그래프 카드 ───── */}
            <section className={styles.graphWrapper}>
                <article className={styles.graphCard}>
                    <h3>모델 지연 시간</h3>
                    {/* 👉 지연 시간 그래프 컴포넌트 삽입 */}
                </article>
                <article className={styles.graphCard}>
                    <h3>읍·면·동별 지연 시간</h3>
                </article>
            </section>
        </div>
    );
}
