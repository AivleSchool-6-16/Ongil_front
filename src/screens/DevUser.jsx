import React, { useEffect, useState } from "react";
import { fetchDevUsers } from "../components/ApiRoute/Dev/Dev.jsx";
import styles from "../styles/DevUser.module.css";

const DevUser = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPermission, setSelectedPermission] = useState("All");

    useEffect(() => {
        fetchDevUsers()
            .then((data) => {
                setUsers(data);
                setFilteredUsers(data);
            })
            .catch((err) => console.error("유저 불러오기 실패:", err))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const filtered = users.filter((user) => {
            const matchesSearch =
                user.E_mail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.Jurisdiction?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesPermission =
                selectedPermission === "All" || user.Permission === selectedPermission;

            return matchesSearch && matchesPermission;
        });

        setFilteredUsers(filtered);
    }, [searchTerm, selectedPermission, users]);

    return (
        <div className={styles.devUser}>
            {/* ───── 검색/필터 바 ───── */}
            <div className={styles.searchbar}>
                <input
                    type="text"
                    placeholder="Search by email or jurisdiction"
                    className={styles.searchInput}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    className={styles.filterSelect}
                    value={selectedPermission}
                    onChange={(e) => setSelectedPermission(e.target.value)}
                >
                    <option value="All">전체</option>
                    <option value="자치구">자치구 사용자</option>
                    <option value="개발자">개발자</option>
                    <option value="자치동">자치동 사용자</option>
                </select>
            </div>

            {/* ───── 테이블 ───── */}
            <div className={styles.tableWrapper}>
                <table className={styles.userTable}>
                    <thead>
                    <tr>
                        <th>E-mail</th>
                        <th>Name</th>
                        <th>Jurisdiction</th>
                        <th>Department</th>
                        <th>CreatDt</th>
                        <th>Permission</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="6" style={{ textAlign: "center", padding: "1rem" }}>
                                로딩 중...
                            </td>
                        </tr>
                    ) : (
                        filteredUsers.map((user, index) => (
                            <tr key={index}>
                                <td>{user.E_mail}</td>
                                <td>{user.Name}</td>
                                <td>{user.Jurisdiction ?? "-"}</td>
                                <td>{user.Department ?? "-"}</td>
                                <td>{user.CreatDt ?? "-"}</td>
                                <td>{user.Permission}</td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DevUser;
