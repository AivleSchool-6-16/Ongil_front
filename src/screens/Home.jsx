import styles from '../styles/Home.module.css';
import React, {useState, useEffect} from 'react';
import WeatherApi from '../components/ApiRoute/WeatherApi.jsx';
import jsonData from "../data/상습결빙구간.json";

const Home = () => {
  const [text, setText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState({
    lat: 37.5666791,
    lon: 126.9782914,
  });
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState('');
  const [cityName, setCityName] = useState('');
  const [map, setMap] = useState(null);
  const [isSatellite, setIsSatellite] = useState(false);

  /* ──────────────── 날씨 관련 함수 ──────────────── */
  const fetchWeather = async (lat, lon) => {
    try {
      const data = await WeatherApi.getCurrentWeather(lat, lon);
      setWeather(data);
      const city = await WeatherApi.getReverseGeo(lat, lon);
      setCityName(city);
    } catch (err) {
      alert('현재 날씨 정보를 가져올 수 없습니다.');
    }
  };

  const fetch5Weather = async (lat, lon) => {
    try {
      const data = await WeatherApi.getForecast(lat, lon);
      const filteredData = data.list.filter((_, index) => index % 8 === 7);
      setForecast(filteredData);
    } catch (err) {
      alert('5일 예보를 가져올 수 없습니다.');
    }
  };

  const searchCities = async (query) => {
    try {
      const data = await WeatherApi.searchCities(query);
      const filteredData = data.filter((r) => r.country === 'KR');
      setSearchResults(filteredData);
    } catch (err) {
      alert('도시를 찾을 수 없습니다.');
    }
  };

  /* ──────────────── 지도 로딩 ──────────────── */
  useEffect(() => {
    fetchWeather(selectedLocation.lat, selectedLocation.lon);
    fetch5Weather(selectedLocation.lat, selectedLocation.lon);

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=08b03f93523dfa3e040fac4f08ce8934&libraries=services&autoload=false`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById('kakao-map');
        const options = {
          center: new window.kakao.maps.LatLng(
              selectedLocation.lat,
              selectedLocation.lon
          ),
          level: 5,
        };
        const mapInstance = new window.kakao.maps.Map(container, options);
        setMap(mapInstance);
        let activeInfoWindow = null;

        jsonData.forEach((item) => {
          if (item['경로'] && item['경로'].length > 0) {
            const roadPath = item['경로'].map(
                ([lng, lat]) => new window.kakao.maps.LatLng(lat, lng)
            );

            // 파스텔 색상 생성
            const getPastelColor = () => {
              const r = Math.floor(Math.random() * 128 + 127);
              const g = Math.floor(Math.random() * 128 + 127);
              const b = Math.floor(Math.random() * 128 + 127);
              return `rgb(${r}, ${g}, ${b})`;
            };

            // 테두리 효과를 위한 이중 Polyline
            const polylineOuter = new window.kakao.maps.Polyline({
              path: roadPath,
              strokeWeight: 6,
              strokeColor: 'black',
              strokeOpacity: 0.7,
              strokeStyle: 'solid',
            });

            const polylineInner = new window.kakao.maps.Polyline({
              path: roadPath,
              strokeWeight: 3,
              strokeColor: getPastelColor(),
              strokeOpacity: 0.9,
              strokeStyle: 'solid',
            });

            polylineOuter.setMap(mapInstance);
            polylineInner.setMap(mapInstance);

            // 중간 지점
            const midIndex = Math.floor(roadPath.length / 2);
            const midPoint = roadPath[midIndex];

            // 클릭 이벤트 (CCTV 기능 제거)
            window.kakao.maps.event.addListener(
                polylineInner,
                'click',
                () => {
                  if (activeInfoWindow) {
                    activeInfoWindow.close();
                  }

                  const infoHtml = `
                  <div style="padding:10px;font-size:14px;line-height:1.5;margin-top:10px;">
                    <h4 style="margin:0 0 5px 0;font-size:16px;font-weight:bold;">${
                      item['도로(노선)명']
                  }</h4>
                    <p><strong>대표지역:</strong> ${item['대표지역']}</p>
                    <p><strong>관리청:</strong> ${item['관리청']}</p>
                    <p><strong>도로길이:</strong> ${item['총길이(km)']} km</p>
                  </div>
                `;

                  const infoWindow = new window.kakao.maps.InfoWindow({
                    position: midPoint,
                    content: infoHtml,
                    removable: true,
                  });

                  infoWindow.open(mapInstance);
                  activeInfoWindow = infoWindow;
                }
            );

            // hover 효과
            window.kakao.maps.event.addListener(
                polylineInner,
                'mouseover',
                () => {
                  polylineOuter.setOptions({
                    strokeWeight: 8,
                    strokeColor: 'black',
                    strokeOpacity: 1,
                  });
                }
            );
            window.kakao.maps.event.addListener(
                polylineInner,
                'mouseout',
                () => {
                  polylineOuter.setOptions({
                    strokeWeight: 6,
                    strokeColor: 'black',
                    strokeOpacity: 0.7,
                  });
                }
            );
          }
        });
      });
    };

    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [jsonData, selectedLocation]);

  /* ──────────────── 지도 타입 토글 ──────────────── */
  const toggleMapType = () => {
    if (!map) {
      return;
    }
    const newType = isSatellite
        ? window.kakao.maps.MapTypeId.ROADMAP
        : window.kakao.maps.MapTypeId.SKYVIEW;
    map.setMapTypeId(newType);
    setIsSatellite(!isSatellite);
  };

  /* ──────────────── 입력·검색 핸들러 ──────────────── */
  const handleInputChange = (e) => {
    const query = e.target.value.trim();
    setText(query);
    if (query) {
      searchCities(query);
    } else {
      setSearchResults([]);
    }
  };

  const handleResultClick = (lat, lon) => {
    setSelectedLocation({lat, lon});
    setText('');
    setSearchResults([]);
  };

  /* ──────────────── 렌더링 ──────────────── */
  return (
      <div className={styles.home}>
        {/* 검색창 */}
        <div className={styles.search}>
          <input
              type="text"
              value={text}
              onChange={handleInputChange}
              placeholder="도시명을 입력하세요"
              className={styles.input}
          />
          {error && <p>{error}</p>}
          {searchResults.length > 0 && (
              <div className={styles.resultList}>
                <ul>
                  {searchResults.map((r, idx) => (
                      <li
                          key={idx}
                          onClick={() => handleResultClick(r.lat, r.lon)}
                          className={styles.resultItem}
                      >
                        {r.name}, {r.country}
                      </li>
                  ))}
                </ul>
              </div>
          )}
        </div>

        {/* 현재 날씨 */}
        <div className={styles.dup}>
          <div className={styles.daycurrent}>
            <h2 className="text-xl font-bold">현재 날씨</h2>
            {weather && (
                <div className={styles.current}>
                  <h3>{cityName}의 날씨</h3>
                  <img
                      src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                      width="50"
                      height="50"
                      alt={weather.weather[0].description}
                  />
                  <p>날씨: {weather.weather[0].description}</p>
                  <p>온도: {weather.main.temp}°C</p>
                  <p>습도: {weather.main.humidity}%</p>
                  <p>강수 확률: {weather.clouds.all}%</p>
                </div>
            )}
          </div>

          {/* 5일 예보 */}
          <div className={styles.day5}>
            <h2 className="text-xl font-bold">5일간의 날씨 예보</h2>
            {forecast && (
                <ul className={styles.list}>
                  {forecast.map((d, idx) => {
                    const date = new Date(d.dt_txt);
                    return (
                        <li key={idx} className={styles.item}>
                          <div className={styles.wrapper}>
                            <img
                                src={`http://openweathermap.org/img/wn/${d.weather[0].icon}.png`}
                                width="50"
                                height="50"
                                alt={d.weather[0].description}
                            />
                            <p className={styles.temp}>
                              {Math.round(d.main.temp_max)}°C
                            </p>
                          </div>
                          <p className={styles.label}>
                            {date.getUTCMonth() + 1}월 {date.getUTCDate()}일
                          </p>
                          <p className={styles.label}>
                            {['일', '월', '화', '수', '목', '금', '토'][
                                date.getUTCDay()
                                ]}
                          </p>
                        </li>
                    );
                  })}
                </ul>
            )}
          </div>
        </div>

        {/* 지도 */}
        <h2 className="text-xl font-bold">지역별 상습 결빙 도로</h2>
        <div id="kakao-map" style={{width: '100%', height: '500px'}}>
          <button
              onClick={toggleMapType}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                zIndex: 1000,
                padding: '10px 20px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                cursor: 'pointer',
                backgroundColor: '#C3E7FA',
              }}
          >
            {isSatellite ? '기본 지도' : '위성 지도'} 보기
          </button>
        </div>
      </div>
  );
};

export default Home;
