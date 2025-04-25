import  { useEffect, useState } from "react";
import styles from "../styles/DevDashboard.module.css";
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import axios from "axios"

export default function DevDashboard() {
    const [stats, setStats] = useState([
        {
            title: "New-Member",
            value: 0,
            unit: "People",
            img: "/images/new-member.png",
            barClass: styles.blueBar,
        },
        {
            title: "Real-Time",
            value: 0,
            unit: "People",
            img: "/images/real-time.png",
            barClass: styles.redBar,
        },
        {
            title: "Today-Visitors",
            value: 0,
            unit: "People",
            img: "/images/today_visitor.png",
            barClass: styles.orangeBar,
        },
        {
            title: "Today-Event",
            value: 0,
            unit: "Event",
            img: "/images/event.png",
            barClass: styles.yellowBar,
        },
    ]);

    const [newMembers, setNewMembers] = useState([]);
    const [visitors, setVisitors] = useState([]);
    const [errorRoutes, setErrorRoutes] = useState([]);
    const [errorTypes, setErrorTypes] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const base = import.meta.env.VITE_SERVER_ROUTE;
                const [realTime, todayVisitors, todayEvents, newMembersCount, nm, vs, er, et] = await Promise.all([
                    axios.get(`${base}/dev/status/real-time`),
                    axios.get(`${base}/dev/status/today-visitors`),
                    axios.get(`${base}/dev/status/today-events`),
                    axios.get(`${base}/dev/status/new-members`),
                    axios.get(`${base}/dev/charts/new-members-monthly`),
                    axios.get(`${base}/dev/charts/visitors-by-month`),
                    axios.get(`${base}/dev/charts/error-routes`),
                    axios.get(`${base}/dev/charts/error-types`),
                ]);

                setStats(prev =>
                    prev.map(stat => {
                        if (stat.title === "Real-Time") {
                            return { ...stat, value: realTime.data.count };
                        }
                        if (stat.title === "Today-Visitors") {
                            return { ...stat, value: todayVisitors.data.count };
                        }
                        if (stat.title === "Today-Event") {
                            return { ...stat, value: todayEvents.data.count };
                        }
                        if (stat.title === "New-Member") {
                            return { ...stat, value: newMembersCount.data.count };
                        }
                        return stat;
                    })
                );

                setNewMembers(nm.data);
                setVisitors(vs.data);
                setErrorRoutes(er.data);
                setErrorTypes(et.data);
            } catch (err) {
                console.error("통계 데이터를 불러오는 데 실패했습니다.", err);
            }
        };

        fetchStats();
    }, []);

    const COLORS = ["#4F60FF", "#00FF33", "#ffc658", "#FF5A1C", "#FF0004", "#FF52CB", "#00E3C8", "#9844DD"];

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
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={newMembers}>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="count" stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>
                </article>
                <article className={styles.graphCard}>
                    <h3>방문자 요약</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={visitors}>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#82ca9d" />
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
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </article>
                <article className={styles.graphCard}>
                    <h3>에러 발생 유형</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={errorTypes}>
                            <XAxis dataKey="status_code" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#ffc658" />
                        </BarChart>
                    </ResponsiveContainer>
                </article>
            </section>
        </div>
    );
}
