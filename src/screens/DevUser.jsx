import styles from "../styles/DevUser.module.css";

const DevUser = () => {
    return (
        <div className={styles.devUser}>
            {/* ───── 검색 바 ───── */}
            <div className={styles.searchbar}>
                <div className={styles.searchbarChild} />
                <img className={styles.sort1Icon} alt="sort" src="/images/sort.png" />
                <div className={styles.searchbarItem} />
                <img className={styles.downArrow1Icon} alt="arrow" src="/images/down-arrow.png" />
                <b className={styles.searchUserFor}>Search User for Email/Local</b>
            </div>

            {/* ───── 사용자 목록 ───── */}
            <div className={styles.userlist}>
                <b className={styles.permission}>Permission</b>
                <b className={styles.department}>Department</b>
                <b className={styles.creatdt}>CreatDt</b>
                <b className={styles.eMail}>E-mail</b>
                <b className={styles.name}>Name</b>
                <b className={styles.jurisdiction}>Jurisdiction</b>

                {/* TODO: users.map(...) 으로 데이터 행 렌더링 */}
                {/* <div className={styles.userRow}> … </div> */}
            </div>
        </div>
    );
};

export default DevUser;
