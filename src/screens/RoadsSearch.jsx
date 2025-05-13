import styles from '../styles/RoadsSearch.module.css';
import {useState, useEffect} from 'react';
import useNavigations from "../components/Navigation/Navigations.jsx";
import locationData from '../data/location_seoul.json';
import LoadingPage from "../components/spinner/LoadingPage.jsx";
import {getDistrict, recommendRoads} from "../components/ApiRoute/roads.jsx";
import {Tooltip} from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const handleEupmyeondongChange = (e) => {
  const selectedEupmyeondong = e.target.value;
  setEupmyeondong(selectedEupmyeondong);

  if (selectedEupmyeondong) {
    getDistrict(selectedEupmyeondong) // 읍면동 이름을 그대로 전달
    .then(response => {
      alert('응답 받은 데이터: ' + JSON.stringify(response));
    })
    .catch(error => {
      console.error("API 호출 실패:", error);
    });
  }
};

const RoadsSearch = () => {
  const [data, setData] = useState([]);
  const [sido, setSido] = useState('');
  const [sigungu, setSigungu] = useState('');
  const [eupmyeondong, setEupmyeondong] = useState('');
  const [sigunguCode, setSigunguCode] = useState(0);

  // 기존 가중치 관련 state (기본 값 20으로 설정)
  const [icingWeight, setIcingWeight] = useState(5);
  const [slopeWeight, setSlopeWeight] = useState(5);
  const [trafficWeight, setTrafficWeight] = useState(5);   // ➕ 교통량 가중치

  // 사고 관련 state (기본 값 20으로 설정)
  const [accidentCount, setAccidentCount] = useState(5); // 사고발생건수
  const [accidentRate, setAccidentRate] = useState(5); // 사고율

  const [sigunguOptions, setSigunguOptions] = useState([]);
  const [eupmyeondongOptions, setEupmyeondongOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 초기 데이터 설정
  useEffect(() => {
    setData(locationData);
  }, []);

  // 시도명 변경 시 시군구명 옵션 업데이트
  useEffect(() => {
    if (sido) {
      const selectedSido = data.find(item => item.sido === sido);
      if (selectedSido) {
        const sigunguList = selectedSido.sigungu.map(item => item.sigungu);
        setSigunguOptions(sigunguList);
      } else {
        setSigunguOptions([]);
      }
      setSigungu('');
      setEupmyeondongOptions([]);
      setEupmyeondong('');
    } else {
      setSigunguOptions([]);
      setSigungu('');
      setEupmyeondongOptions([]);
      setEupmyeondong('');
    }
  }, [sido, data]);

  // 시군구명 변경 시 읍면동명 옵션 업데이트
  useEffect(() => {
    if (sido && sigungu) {
      const selectedSido = data.find(item => item.sido === sido);
      if (selectedSido) {
        const selectedSigungu = selectedSido.sigungu.find(
            item => item.sigungu === sigungu
        );
        if (selectedSigungu) {
          const eupmyeondongList = selectedSigungu.eupmyeondong.map(
              item => item.eupmyeondong
          );
          setEupmyeondongOptions(eupmyeondongList);
        } else {
          setEupmyeondongOptions([]);
        }
      } else {
        setEupmyeondongOptions([]);
      }
      setEupmyeondong('');
    } else {
      setEupmyeondongOptions([]);
      setEupmyeondong('');
    }
  }, [sigungu, sido, data]);

  // 가중치 변경 핸들러 ─────────────────────────────────────
  const handleWeightChange = (setter) => (e) => {
    const value = parseInt(e.target.value || "0", 10);
    if (value < 0 || value > 10) {
      return;
    }
    setter(value);
  };

  // 읍면동
  const handleEupmyeondongChange = (e) => {
    const selectedEupmyeondong = e.target.value;
    setEupmyeondong(selectedEupmyeondong);

    if (selectedEupmyeondong && sigungu) {
      // 선택된 시군구에서 sigungu_code 찾기
      const selectedSido = data.find(item => item.sido === sido);
      const selectedSigungu = selectedSido?.sigungu.find(
          item => item.sigungu === sigungu);
      const sigunguCode = selectedSigungu?.sigungu_code; // 시군구 코드
      setSigunguCode(selectedSigungu?.sigungu_code);

      if (sigunguCode) {
        getDistrict(selectedEupmyeondong, sigunguCode) // 읍면동 + 시군구 코드 전달
        .then(responseMessage => {
          alert(responseMessage);
        })
        .catch(error => {
          console.error("API 호출 실패:", error);
        });
      } else {
        alert("시군구 코드 정보를 찾을 수 없습니다.");
      }
    }
  };

  const navigateTo = useNavigations();
  // 검색 버튼 클릭 ────────────────────────────────────────
  const handleNavigation = () => {
    if (sido && sigungu && eupmyeondong) {
      // ① 모든 값이 0이면 균등 분배
      let weights = [icingWeight, slopeWeight, accidentCount, accidentRate,
        trafficWeight]; // 🔄 5개
      const allZero = weights.every(w => w === 0);

      let [newIcing, newSlope, newAccCnt, newAccRate, newTraffic] =
          [icingWeight, slopeWeight, accidentCount, accidentRate,
            trafficWeight];

      if (allZero) {
        newIcing = newSlope = newAccCnt = newAccRate = newTraffic = 2;  // 2씩 10 맞춤
      } else {
        const total = weights.reduce((sum, w) => sum + w, 0);
        if (total > 0) {
          const scale = 10 / total;
          newIcing *= scale;
          newSlope *= scale;
          newAccCnt *= scale;
          newAccRate *= scale;
          newTraffic *= scale;
        }
      }

      // ② 백엔드 요구 형식으로 payload 작성
      const userWeights = {
        region: `${eupmyeondong}`,      // 🔄 sigungu 제거
        rd_fr_weight: newIcing,
        rd_slope_weight: newSlope,
        acc_occ_weight: newAccCnt,
        acc_sc_weight: newAccRate,
        traff_weight: newTraffic,    // ➕ 추가
      };

      setIsLoading(true);
      recommendRoads(userWeights)
      .then(res => {
        setIsLoading(false);
        navigateTo('RoadsRecommend', {
          sido, sigungu, eupmyeondong,
          recommendedRoads: res,
        });
      })
      .catch(err => {
        setIsLoading(false);
        alert('도로 추천에 실패했습니다. 다시 시도해주세요.');
        console.error(err);
      });
    } else {
      alert("모든 주소 필드를 선택해주세요.");
    }
  };

  const increments = Array.from({length: 21}, (_, i) => i * 5);

  return (
      <div className={styles.roadssearch}>
        <div className={styles.roadsSearchForm}>
          {isLoading ? (
              <LoadingPage isLoading={isLoading}/>
          ) : (
              <div className={styles.form}>
                <h2>
                  열선 도로를 설치할 자치구별 동을 입력해주세요.
                </h2>

                {/* 시도명 드롭다운 */}
                <div className={styles.dup}>
                  <label className={styles.inputTxt}>시도명:</label>
                  <select
                      className={styles.select}
                      value={sido}
                      onChange={(e) => setSido(e.target.value)}
                  >
                    <option value="">선택하세요</option>
                    {data.map((item, index) => (
                        <option key={index} value={item.sido}>
                          {item.sido}
                        </option>
                    ))}
                  </select>
                </div>

                {/* 시군구명 드롭다운 */}
                <div className={styles.dup}>
                  <label className={styles.inputTxt}>시군구명:</label>
                  <select
                      className={styles.select}
                      value={sigungu}
                      onChange={(e) => setSigungu(e.target.value)}
                      disabled={!sido}
                  >
                    <option value="">선택하세요</option>
                    {sigunguOptions.map((sigunguItem, index) => (
                        <option key={index} value={sigunguItem}>
                          {sigunguItem}
                        </option>
                    ))}
                  </select>
                </div>

                {/* 읍면동명 드롭다운 */}
                <div className={styles.dup}>
                  <label className={styles.inputTxt}>읍면동명:</label>
                  <select
                      className={styles.select}
                      value={eupmyeondong}
                      onChange={(e) => handleEupmyeondongChange(
                          e)} // 이벤트 핸들러 호출
                      disabled={!sigungu} // 시군구가 선택되지 않으면 읍면동을 선택할 수 없도록 비활성화
                  >
                    <option value="">선택하세요</option>
                    {eupmyeondongOptions.map((dongItem, index) => (
                        <option key={index} value={dongItem}>
                          {dongItem}
                        </option>
                    ))}
                  </select>
                </div>

                <p style={{opacity: 0.9}}>
                  * 중요도 비율을 지정하신대로 열선도로를 추천합니다.
                  <span style={{color: 'red'}}></span>
                </p>
                {/* 0~100 사이의 숫자를 바 형태로 늘리며 선택할 수 있는 필드 */}
                <div className={styles.weightContainer}>
                  <div className={styles.weightItem}>
                    <a data-tooltip-id="a" data-tooltip-content="노면온도로 예측한 결빙확률"
                       data-tooltip-place="top">
                      <label className={styles.weightLabel}>결빙 가능성</label>
                    </a>
                    <Tooltip id="a" style={{marginTop: "20px"}}/>
                    <input
                        type="range"
                        min="0"
                        max="10"
                        value={icingWeight || 0} // 0이면 가장 왼쪽에 위치하도록 설정
                        onChange={handleWeightChange(setIcingWeight)}
                        className={styles.weightRange}
                    />
                    <span>{icingWeight || 0}</span> {/* 선택된 숫자 표시 */}
                  </div>
                  <div className={styles.weightItem}>
                    <a data-tooltip-id="a"
                       data-tooltip-content="도로구간 별 기점과 종점의 고도차이"
                       data-tooltip-place="top">
                      <label className={styles.weightLabel}>경사도</label>
                    </a>
                    <Tooltip id="a" style={{marginTop: "20px"}}/>
                    <input
                        type="range"
                        min="0"
                        max="10"
                        value={slopeWeight || 0} // 0이면 가장 왼쪽에 위치하도록 설정
                        onChange={handleWeightChange(setSlopeWeight)}
                        className={styles.weightRange}
                    />
                    <span>{slopeWeight || 0}</span> {/* 선택된 숫자 표시 */}
                  </div>

                  {/* 사고발생건수와 사고율 입력 필드 */}
                  <div className={styles.weightItem}>
                    <a data-tooltip-id="a" data-tooltip-content="결빙 사고가 발생한 건수"
                       data-tooltip-place="top">
                      <label className={styles.weightLabel}>결빙사고건수</label>
                    </a>
                    <Tooltip id="a" style={{marginTop: "20px"}}/>
                    <input
                        type="range"
                        min="0"
                        max="10"
                        value={accidentCount || 0} // 0이면 가장 왼쪽에 위치하도록 설정
                        onChange={handleWeightChange(setAccidentCount)}
                        className={styles.weightRange}
                    />
                    <span>{accidentCount || 0}</span> {/* 선택된 숫자 표시 */}
                  </div>
                  <div className={styles.weightItem}>
                    <a
                        data-tooltip-id="b"
                        data-tooltip-place="top"
                    >
                      <label className={styles.weightLabel}>사고심각도</label>
                    </a>
                    <Tooltip
                        id="b"
                        place="top"
                        style={{marginTop: "10px", textAlign: "center"}}
                        content={
                          <>
                            사망자수 x 1.0 + 중상자수 x 0.7 + 경상자수 x 0.3
                            <br/>
                            * 출처: 한국교통안전공단
                          </>
                        }
                    />

                    <input
                        type="range"
                        min="0"
                        max="10"
                        value={accidentRate || 0} // 0이면 가장 왼쪽에 위치하도록 설정
                        onChange={handleWeightChange(setAccidentRate)}
                        className={styles.weightRange}
                    />
                    <span>{accidentRate || 0}</span> {/* 선택된 숫자 표시 */}
                  </div>
                  {/* ➕ 교통량 가중치 슬라이더 */}
                  <div className={styles.weightItem}>
                    <a data-tooltip-id="c"
                       data-tooltip-content="해당 도로의 평상시 교통량(추정)"
                       data-tooltip-place="top">
                      <label className={styles.weightLabel}>교통량</label>
                    </a>
                    <Tooltip id="c" style={{marginTop: "20px"}}/>
                    <input
                        type="range"
                        min="0"
                        max="10"
                        value={trafficWeight || 0}
                        onChange={handleWeightChange(setTrafficWeight)}
                        className={styles.weightRange}
                    />
                    <span>{trafficWeight || 0}</span>
                  </div>
                </div>

                {/* 검색 버튼 */}
                <div className={styles.searchBtn} onClick={handleNavigation}>
                  검색
                </div>
              </div>
          )}
        </div>
      </div>
  );
};

export default RoadsSearch;
