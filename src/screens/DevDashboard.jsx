import {useEffect, useState} from "react";
import styles from "../styles/DevDashboard.module.css";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import axios from "axios"

export default function DevDashboard() {
  const base = import.meta.env.VITE_SERVER_ROUTE;  /* ───────── 카드용 통계 ───────── */
  const [stats, setStats] = useState([
    {
      title: "New-Member",
      value: 0,
      unit: "People",
      img: "/images/new-member.png",
      barClass: styles.blueBar
    },
    {
      title: "Real-Time",
      value: 0,
      unit: "People",
      img: "/images/real-time.png",
      barClass: styles.redBar
    },
    {
      title: "Today-Visitors",
      value: 0,
      unit: "People",
      img: "/images/today_visitor.png",
      barClass: styles.orangeBar
    },
    {
      title: "Today-Event",
      value: 0,
      unit: "Event",
      img: "/images/event.png",
      barClass: styles.yellowBar
    }
  ]);

  /* ───────── 그래프 데이터 ───────── */
  const [newMembers, setNewMembers] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [errorRoutes, setErrorRoutes] = useState([]);
  const [errorTypes, setErrorTypes] = useState([]);

  /* ───────── 실시간 유저 모달 ───────── */
  const [showModal, setShowModal] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  /* ===== 통계 & 그래프 한꺼번에 로드 ===== */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [
          realTime, todayVisitors, todayEvents, newMembersCnt,
          nm, vs, er, et
        ] = await Promise.all([
          axios.get(`${base}/dev/status/real-time`),
          axios.get(`${base}/dev/status/today-visitors`),
          axios.get(`${base}/dev/status/today-events`),
          axios.get(`${base}/dev/status/new-members`),
          axios.get(`${base}/dev/charts/new-members-monthly`),
          axios.get(`${base}/dev/charts/visitors-by-month`),
          axios.get(`${base}/dev/charts/error-routes`),
          axios.get(`${base}/dev/charts/error-types`)
        ]);

        setStats(s =>
            s.map(card => {
              if (card.title === "Real-Time") {
                return {
                  ...card,
                  value: realTime.data.count
                };
              }
              if (card.title === "Today-Visitors") {
                return {
                  ...card,
                  value: todayVisitors.data.count
                };
              }
              if (card.title === "Today-Event") {
                return {
                  ...card,
                  value: todayEvents.data.count
                };
              }
              if (card.title === "New-Member") {
                return {
                  ...card,
                  value: newMembersCnt.data.count
                };
              }
              return card;
            })
        );
        setNewMembers(nm.data);
        setVisitors(vs.data);
        setErrorRoutes(er.data);
        setErrorTypes(et.data);
      } catch (e) {
        console.error("통계 로드 실패", e);
      }
    };
    fetchAll();
  }, []);
  /* ===== Real-Time 카드 클릭 ===== */
  const openRealTimeModal = async () => {
    try {
      const {data} = await axios.get(`${base}/dev/status/real-time/users`);
      setOnlineUsers(data);
      setShowModal(true);
    } catch (e) {
      alert("실시간 접속자 목록을 불러오지 못했습니다.");
    }
  };

  const COLORS = ["#4F60FF", "#00FF33", "#ffc658", "#FF5A1C", "#FF0004",
    "#FF52CB", "#00E3C8", "#9844DD"];

  return (
      <div className={styles.devDashboard}>
        {/* ───────── 통계 카드 영역 ───────── */}
        <section className={styles.statWrapper}>
          {stats.map(({title, value, unit, img, barClass}) => (
              <article
                  key={title}
                  className={styles.statCard}
                  onClick={title === "Real-Time" ? openRealTimeModal
                      : undefined}  /* 🔄 클릭 활성화 */
                  style={{
                    cursor: title === "Real-Time" ? "pointer" : "default"
                  }}
              >
                <div className={`${styles.statBar} ${barClass}`}/>
                <img className={styles.statIcon} src={img} alt={title}/>
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
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={newMembers}>
                <XAxis dataKey="month"/>
                <YAxis/>
                <Tooltip/>
                <Legend/>
                <Line type="monotone" dataKey="count" stroke="#8884d8"/>
              </LineChart>
            </ResponsiveContainer>
          </article>
          <article className={styles.graphCard}>
            <h3>방문자 요약</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={visitors}>
                <XAxis dataKey="month"/>
                <YAxis/>
                <Tooltip/>
                <Bar dataKey="count" fill="#82ca9d"/>
              </BarChart>
            </ResponsiveContainer>
          </article>
          <article className={styles.graphCard}>
            <h3>에러 발생 지점</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                    data={errorRoutes}
                    dataKey="count"
                    nameKey="route"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                >
                  {errorRoutes.map((_, index) => (
                      <Cell key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}/>
                  ))}
                </Pie>
                <Tooltip/>
              </PieChart>
            </ResponsiveContainer>
          </article>
          <article className={styles.graphCard}>
            <h3>에러 발생 유형</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={errorTypes}>
                <XAxis dataKey="status_code"/>
                <YAxis/>
                <Tooltip/>
                <Bar dataKey="count" fill="#ffc658"/>
              </BarChart>
            </ResponsiveContainer>
          </article>
        </section>
        {showModal && (
            <div className={styles.modalBackdrop}
                 onClick={() => setShowModal(false)}>
              <div className={styles.modalContent}
                   onClick={e => e.stopPropagation()}>
                <h2>실시간 접속 중인 유저</h2>
                {onlineUsers.length ? (
                    <table className={styles.userTable}>
                      <thead>
                      <tr>
                        <th>Email</th>
                        <th>Name</th>
                        <th>Dept</th>
                      </tr>
                      </thead>
                      <tbody>
                      {onlineUsers.map(u => (
                          <tr key={u.email}>
                            <td>{u.email}</td>
                            <td>{u.name}</td>
                            <td>{u.department || "-"}</td>
                          </tr>
                      ))}
                      </tbody>
                    </table>
                ) : <p style={{textAlign: "center"}}>현재 접속 중인 사용자가 없습니다.</p>}
                <button className={styles.closeBtn}
                        onClick={() => setShowModal(false)}>닫기
                </button>
              </div>
            </div>
        )}
      </div>
  );
}
