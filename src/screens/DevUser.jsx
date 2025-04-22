import DevSidenav from "../components/nav/dev/SideNavigationBar.jsx";
import UserHeader from "../components/nav/dev/DynamicHeader.jsx";
import styles from "../styles/monitorUser.module.css";

const DevUser = () => {
    return (
        <div className={styles.div}>
            <DevSidenav />
            <main className={styles.userControlContainerWrapper}>
                <section className={styles.userControlContainer}>
                    <UserHeader />
                    {/*<div className={[styles.userlist]}>*/}
                    {/*    <div className={styles.userlistChild} />*/}
                    {/*    <div className={styles.userTableHeader}>*/}
                    {/*        <div className={styles.userTableHeaderChild} />*/}
                    {/*        <div className={styles.nameHeader}>*/}
                    {/*            <b className={styles.eMail}>E-mail</b>*/}
                    {/*            <div className={styles.nameHeaderChild} />*/}
                    {/*        </div>*/}
                    {/*        <div className={styles.nameHeader1}>*/}
                    {/*            <b className={styles.eMail}>Name</b>*/}
                    {/*            <div className={styles.nameHeaderItem} />*/}
                    {/*        </div>*/}
                    {/*        <div className={styles.departmentHeader}>*/}
                    {/*            <div className={styles.departmentHeaderLabels}>*/}
                    {/*                <b className={styles.eMail}>Jurisdiction</b>*/}
                    {/*                <div className={styles.departmentHeaderLabelsChild} />*/}
                    {/*            </div>*/}
                    {/*            <div className={styles.departmentHeaderLabels1}>*/}
                    {/*                <b className={styles.eMail}>Department</b>*/}
                    {/*                <div className={styles.departmentHeaderLabelsItem} />*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*        <div className={styles.dateHeader}>*/}
                    {/*            <div className={styles.dateHeaderLabel}>*/}
                    {/*                <b className={styles.eMail}>CreatDt</b>*/}
                    {/*                <div className={styles.dateHeaderLabelChild} />*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*        <div className={styles.permissionHeader}>*/}
                    {/*            <b className={styles.eMail}>Permission</b>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*    <div className={styles.userTableRowOneDataParent}>*/}
                    {/*        <div className={styles.userTableRowOneData} />*/}
                    {/*        <div className={styles.userTableRowOneData1} />*/}
                    {/*        <div className={styles.jurisdictionRow}>*/}
                    {/*            <div className={styles.userTableRowTwoData} />*/}
                    {/*            <div className={styles.userTableRowTwoData1} />*/}
                    {/*        </div>*/}
                    {/*        <div className={styles.userTableRowOneData2} />*/}
                    {/*        <div className={styles.userTableRowOneData3} />*/}
                    {/*    </div>*/}
                    {/*    <div className={styles.userTableDataParent}>*/}
                    {/*        <div className={styles.userTableData} />*/}
                    {/*        <div className={styles.userTableData1} />*/}
                    {/*        <div className={styles.userTableData2} />*/}
                    {/*        <div className={styles.userTableData3} />*/}
                    {/*        <div className={styles.userTableData4} />*/}
                    {/*        <div className={styles.userTableData5} />*/}
                    {/*        <div className={styles.userTableRowThreeParent}>*/}
                    {/*            <div className={styles.userTableRowThree} />*/}
                    {/*            <div className={styles.userTableRowFour} />*/}
                    {/*            <div className={styles.userTableRowFive} />*/}
                    {/*            <div className={styles.userTableRowSix} />*/}
                    {/*            <div className={styles.userTableRowSeven} />*/}
                    {/*            <div className={styles.userTableRowEight} />*/}
                    {/*        </div>*/}
                    {/*        <div className={styles.userTableData6} />*/}
                    {/*        <div className={styles.userTableData7} />*/}
                    {/*        <div className={styles.userTableData8} />*/}
                    {/*        <div className={styles.userTableData9} />*/}
                    {/*        <div className={styles.userTableData10} />*/}
                    {/*        <div className={styles.userTableData11} />*/}
                    {/*        <div className={styles.rectangleParent}>*/}
                    {/*            <div className={styles.userTableRowThree} />*/}
                    {/*            <div className={styles.userTableRowFour} />*/}
                    {/*            <div className={styles.userTableRowFive} />*/}
                    {/*            <div className={styles.userTableRowSix} />*/}
                    {/*            <div className={styles.userTableRowSeven} />*/}
                    {/*            <div className={styles.userTableRowEight} />*/}
                    {/*        </div>*/}
                    {/*        <div className={styles.userTableData12} />*/}
                    {/*        <div className={styles.userTableData13} />*/}
                    {/*        <div className={styles.userTableData14} />*/}
                    {/*        <div className={styles.userTableData15} />*/}
                    {/*        <div className={styles.userTableData16} />*/}
                    {/*        <div className={styles.userTableData17} />*/}
                    {/*        <div className={styles.rectangleGroup}>*/}
                    {/*            <div className={styles.userTableRowThree} />*/}
                    {/*            <div className={styles.userTableRowFour} />*/}
                    {/*            <div className={styles.userTableRowFive} />*/}
                    {/*            <div className={styles.userTableRowSix} />*/}
                    {/*            <div className={styles.userTableRowSeven} />*/}
                    {/*            <div className={styles.userTableRowEight} />*/}
                    {/*        </div>*/}
                    {/*        <div className={styles.userTableData18} />*/}
                    {/*        <div className={styles.userTableData19} />*/}
                    {/*        <div className={styles.userTableData20} />*/}
                    {/*        <div className={styles.userTableData21} />*/}
                    {/*        <div className={styles.userTableData22} />*/}
                    {/*        <div className={styles.userTableData23} />*/}
                    {/*        <div className={styles.rectangleContainer}>*/}
                    {/*            <div className={styles.userTableRowThree} />*/}
                    {/*            <div className={styles.userTableRowFour} />*/}
                    {/*            <div className={styles.userTableRowFive} />*/}
                    {/*            <div className={styles.userTableRowSix} />*/}
                    {/*            <div className={styles.userTableRowSeven} />*/}
                    {/*            <div className={styles.userTableRowEight} />*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </section>
            </main>
        </div>
    );
};

export default DevUser;
