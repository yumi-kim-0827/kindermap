import { useEffect, useRef, useState } from "react";

const NaverMap = ({ list, onClick }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [markers, setMarkers] = useState([]); //지도 마커 상태관리
  const NV_CLIENT_ID = process.env.NEXT_PUBLIC_NCP_CLIENT_ID;

  useEffect(() => {
    const handleScriptLoad = () => {
      if (window.naver && window.naver.maps) {
        const mapInstance = new naver.maps.Map(mapRef.current, {
          logoControl: false,
          center: new naver.maps.LatLng(37.3595704, 127.105399),
          zoom: 14,
        });
        setMap(mapInstance);
        setScriptLoaded(true); // 스크립트 로드 완료
      } else {
        console.error("Naver Maps API not loaded.");
      }
    };

    if (window.naver && window.naver.maps) {
      handleScriptLoad();
    } else {
      const script = document.createElement("script");
      script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${NV_CLIENT_ID}&submodules=geocoder`;
      script.async = true;
      script.onload = handleScriptLoad;
      script.onerror = () => console.error("Failed to load Naver Maps API");
      document.head.appendChild(script);
    }
  }, [NV_CLIENT_ID]);

  // 지도 및 마커를 초기화하는 함수
  const initializeMapAndMarkers = () => {
    if (map) {
      // 기존 마커 제거
      markers.forEach((marker) => marker.setMap(null));
      setMarkers([]);
    }
  };

  const listToCoordinate = (list) => {
    if (!list || !map || !scriptLoaded) return;

    if (window.naver && window.naver.maps && window.naver.maps.Service) {
      const newMarkers = []; // 새로 추가될 마커를 저장할 배열

      list.forEach((item) => {
        const address = item.craddr[0];
        const kinderName = item.crname[0];
        naver.maps.Service.geocode({ query: address }, (status, response) => {
          const geocodeResult = response.v2.addresses[0];
          const { x: longitude, y: latitude } = geocodeResult;

          //원래 item 객체에 네이버 맵이 만들어준 geocode(위도, 경도) 추가
          const extendedItem = { ...item, geocodeResult };

          // 지도 중심 변경 및 마커 추가
          map.setCenter(new naver.maps.LatLng(latitude, longitude));
          const marker = new naver.maps.Marker({
            map: map,
            position: new naver.maps.LatLng(latitude, longitude),
          });
          newMarkers.push(marker); // 새로 추가된 마커 저장

          // 새로 추가된 마커를 상태에 저장
          setMarkers(newMarkers);

          //정보창 표시
          // 정보창 객체
          const infowindow = new naver.maps.InfoWindow({
            content: ['<div class="iw_inner">', `${kinderName}`, "</div>"].join(
              ""
            ),
          });

          naver.maps.Event.addListener(marker, "click", function (e) {
            if (infowindow.getMap()) {
              infowindow.close();
            } else {
              infowindow.open(map, marker);
              //맵에서 마커를 클릭해면 해당 객체의 상세 정보 전달
              onClick(extendedItem);
            }
          });
        });
      });
    } else {
      console.error("Naver Maps Service not available.");
    }
  };

  if (!list) {
    alert("리스트를 찾을 수 없습니다.");
  }

  useEffect(() => {
    initializeMapAndMarkers();
    listToCoordinate(list);
  }, [list]);

  return (
    <div>
      <div ref={mapRef} style={{ width: "1000px", height: "500px" }}></div>
    </div>
  );
};

export default NaverMap;