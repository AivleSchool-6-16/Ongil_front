// NotFound.jsx
import 'react';
import styles from '../styles/NotFound.module.css';


const NotFound = () => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
      <div className={styles.container}>
        <div className={styles.image}>
          <img
              src="/images/notfound.png"
              srcSet="/images/notfound-small.png 480w, /images/page-not-found.png"
              alt="Page Not Found Illustration"
          />
        </div>
        <h1 className={styles.h1}>404</h1>
        <p className={styles.p}>페이지를 찾을 수 없습니다. 잘못된 URL이거나 페이지가 삭제되었을 수 있습니다.</p>

        <div className={styles.btn_container}>
          <button onClick={handleGoHome} className={styles.btn} aria-label="홈으로 가기">
            홈으로 가기
          </button>
          <button onClick={handleGoBack} className={styles.btn}
                  aria-label="이전 페이지로 돌아가기">
            이전 페이지로 돌아가기
          </button>
        </div>
      </div>
  );
};

export default NotFound;
