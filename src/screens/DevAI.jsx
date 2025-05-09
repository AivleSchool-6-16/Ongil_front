/* ================================================================
 * DevAI.jsx  –  개발자 AI 모니터링 대시보드 (React + Recharts)
 *   · Today‑Predict / Predict‑AVG  : 상단 통계 카드
 *   · 최근 예측 로그               : 스크롤 테이블
 *   · 읍·면·동 평균 지연           : 막대그래프
 * ================================================================*/

import React, {useEffect, useState} from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import {
  fetchTodayStats,
  fetchRecentPredictLogs,
  fetchRegionLatency
} from "../components/ApiRoute/Dev/Dev.jsx";
import styles from "../styles/DevAI.module.css";

export default function DevAi() {
  /* ───────── state ───────── */
  const [stats, setStats] = useState([
    {
      title: "Today-Predict",
      value: 0,
      unit: "Predict",
      img: "/images/today_predict.png",
      barClass: styles.orangeBar
    },
    {
      title: "Predict-AVG",
      value: 0,
      unit: "ms",
      img: "/images/predict_avg.png",
      barClass: styles.blueBar
    }
  ]);

  const [logs, setLogs] = useState([]);
  const [regionLatency, setRegionLatency] = useState([]);

  /* ───────── fetch on mount ───────── */
  useEffect(() => {
    async function init() {
      try {
        const [today, recentLogs, latencyData] = await Promise.all([
          fetchTodayStats(),
          fetchRecentPredictLogs(30),
          fetchRegionLatency()
        ]);

        // 통계 카드 값 갱신
        setStats(s =>
            s.map(card => {
              if (card.title === "Today-Predict") {
                return {...card, value: today.today_predict};
              }
              if (card.title === "Predict-AVG") {
                return {...card, value: today.predict_avg_ms};
              }
              return card;
            })
        );

        setLogs(recentLogs);
        setRegionLatency(latencyData);
      } catch (err) {
        console.error(err);
      }
    }

    init();
  }, []);

  /* ───────── render ───────── */
  return (
      <div className={styles.devAi}>
        {/* ───── 통계 카드 ───── */}
        <section className={styles.statWrapper}>
          {stats.map(({title, value, unit, img, barClass}) => (
              <article className={styles.statCard} key={title}>
                <div className={`${styles.statBar} ${barClass}`}/>
                <img className={styles.statIcon} src={img} alt={title}/>
                <span className={styles.statValue}>{value}</span>
                <span className={styles.statUnit}>{unit}</span>
                <span className={styles.statTitle}>{title}</span>
              </article>
          ))}
        </section>

        {/* ───── 그래프 카드 ───── */}
        <section className={styles.graphWrapper}>
          {/* 최근 예측 로그 테이블 */}
          <article className={styles.graphCard}>
            <h3>최근 AI 예측 로그</h3>
            <div className={styles.tableScroll}>
              <table className={styles.logTable}>
                <thead>
                <tr>
                  <th>Email</th>
                  <th>Nickname</th>
                  <th>Region</th>
                  <th>Latency (ms)</th>
                  <th>Weights</th>
                  <th>Time</th>
                </tr>
                </thead>
                <tbody>
                {logs.map(l => (
                    <tr key={`${l.email}-${l.time}`}>
                      <td>{l.email}</td>
                      <td>{l.nickname || "-"}</td>
                      <td>{l.region}</td>
                      <td>{l.latency}</td>
                      <td>{l.weights}</td>
                      <td>{new Date(l.time).toLocaleString()}</td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
          </article>

          {/* 읍·면·동별 평균 지연 시간 */}
          <article className={styles.graphCard}>
            <h3>읍·면·동별 평균 지연 시간(ms)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={regionLatency}>
                <XAxis dataKey="region" interval={0} angle={-30} dy={10}
                       fontSize={10}/>
                <YAxis/>
                <Tooltip/>
                <Bar dataKey="avg_latency_ms"/>
              </BarChart>
            </ResponsiveContainer>
          </article>
        </section>
      </div>
  );
}