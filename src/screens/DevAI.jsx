/* ──────────────────────────────────────────────────────────────────
 * DevAi.jsx  ―  AI 모델 모니터링 대시보드
 * ----------------------------------------------------------------*/

import {useEffect, useState} from "react";
import styles from "../styles/DevAI.module.css";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell
} from "recharts";

import {
  fetchDevAiStats, // /dev/status/ai-monitoring
  fetchAiLogs      // /dev/ai/logs?limit=10
} from "../components/ApiRoute/Dev/Dev.jsx";

/* 하단 색상 스트립 클래스 */
const {blueBar, orangeBar} = styles;

export default function DevAi() {
  /* ───── 상태 ───── */
  const [cards, setCards] = useState([]);   // 통계 카드 2 개
  const [regionLat, setRegionLat] = useState([]);   // 지역별 평균 지연
  const [aiLogs, setAiLogs] = useState([]);   // 최근 예측 로그
  const [modalJson, setModalJson] = useState(null); // JSON 모달

  /* ───── 최초 로딩 ───── */
  useEffect(() => {
    (async () => {
      try {
        const [statRes, logRes] = await Promise.all([
          fetchDevAiStats(),
          fetchAiLogs(10)
        ]);

        const s = statRes.data;

        // ▶ 통계 카드 두 개
        setCards([
          {
            title: "Today-Predict",
            value: s.today_predict_count,
            unit: "건",
            img: "/images/today_predict.png",
            bar: orangeBar
          },
          {
            title: "Avg-Latency",
            value: `${s.model_latency} ms`,
            img: "/images/latency.png",
            bar: blueBar
          }
        ]);

        setRegionLat(s.latency_by_region);
        setAiLogs(logRes.data);
      } catch (err) {
        console.error("AI 대시보드 로딩 실패:", err);
      }
    })();
  }, []);

  /* ───── 그래프 색상 ───── */
  const BAR_COLOR = "#4F60FF";

  return (
      <div className={styles.devAi}>

        {/* ──────── 통계 카드 ──────── */}
        <section className={styles.statWrapper}>
          {cards.map(({title, value, unit = "", img, bar}) => (
              <article className={styles.statCard} key={title}>
                <div className={`${styles.statBar} ${bar}`}/>
                <img className={styles.statIcon} src={img} alt={title}/>
                <span className={styles.statValue}>{value}</span>
                {unit && <span className={styles.statUnit}>{unit}</span>}
                <span className={styles.statTitle}>{title}</span>
              </article>
          ))}
        </section>

        {/* ──────── 그래프 + 로그 ──────── */}
        <section className={styles.graphWrapper}>
          {/* ▸ 읍·면·동별 평균 지연 */}
          <article className={styles.graphCard}>
            <h3>읍·면·동별 평균 지연 (ms)</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={regionLat}>
                <XAxis dataKey="region" hide/>
                <YAxis/>
                <Tooltip formatter={v => `${v} ms`}/>
                <Bar dataKey="latency">
                  {regionLat.map((_, i) => <Cell key={i} fill={BAR_COLOR}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </article>

          {/* ▸ 최근 예측 로그 */}
          <article className={styles.graphCard}>
            <h3>최근 AI 예측 로그 (10건)</h3>
            <div className={styles.logWrap}>
              <table className={styles.logTable}>
                <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Region</th>
                  <th>Latency</th>
                  <th>Weights<br/>(I/S/AS/T)</th>
                  <th>Time</th>
                </tr>
                </thead>
                <tbody>
                {aiLogs.map(l => (
                    <tr key={l.id} onClick={() => setModalJson(l)}>
                      <td>{l.id}</td>
                      <td>{l.user_email}</td>
                      <td>{l.region}</td>
                      <td>{l.latency}</td>
                      <td>{`${l.icing_weight}/${l.slope_weight}/` +
                          `${l.accident_severity_weight}/${l.traffic_weight}`}</td>
                      <td>{l.timestamp.slice(0, 19).replace("T", " ")}</td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
          </article>
        </section>

        {/* ──────── JSON 모달 ──────── */}
        {modalJson && (
            <div className={styles.backdrop} onClick={() => setModalJson(null)}>
          <pre
              className={styles.jsonModal}
              onClick={e => e.stopPropagation()}
          >
            {JSON.stringify(modalJson, null, 2)}
          </pre>
            </div>
        )}
      </div>
  );
}
