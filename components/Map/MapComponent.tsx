"use client";
import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

// leaflet은 css가 필요함!
import "./MapComponent.scss";
import styles from "./MapComponent.module.scss";
import { DivIcon, Icon, LatLng, point } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

/**
 *
 * @참고자료 : https://leafletjs.com/reference.html
 */
const MapComponent = () => {
  const [isMount, setIsMount] = useState<boolean>(false);

  /**
   * @position : 창원 시청 중심좌표
   */
  const position = { lat: 35.22783, lng: 128.679315 };

  /**
   * @markers : 마커 위치
   */
  const markers = [
    {
      geoCode: { lat: 35.22783, lng: 128.679315 },
      popup: "취급업체",
    },
    {
      geoCode: { lat: 35.226360785943285, lng: 128.68222982315095 },
      popup: "창원시청1",
    },
    {
      geoCode: { lat: 35.2329, lng: 128.68222982315095 },
      popup: "창원시청2",
    },
    {
      geoCode: { lat: 35.23285, lng: 128.6722 },
      popup: "창원시청3",
    },
    {
      geoCode: { lat: 35.226360785943285, lng: 128.6722 },
      popup: "창원시청4",
    },
  ];

  const customIcon = new Icon({
    iconUrl: "/img/marker.svg",
    iconSize: [24, 24],
  });

  /**
   * @clickLatLng : 클릭된 점의 좌표
   * @centerLatLng : 지도 중심 좌표
   */
  const [clickLatLng, setClickLatLng] = useState<any | null>(null);
  const [centerLatLng, setCenterLatLng] = useState<any | null>(null);
  useEffect(() => {
    setIsMount(true);
  }, []);

  /**
   * 클러스터 아이콘 생성
   */
  const createCustomClusterIcon = (cluster: any) => {
    return new DivIcon({
      html: `<div class="cluster-icon">${cluster.getChildCount()}</div>`,
      className: "custom-marker-cluster",
      iconSize: point(33, 33, true),
    });
  };

  const DrawingAndListingMarker = ({ markers }: any) => {
    const map = useMapEvents({
      // 지도가 초기화될 때(중심과 확대/축소가 처음으로 설정될 때) 시작됩니다.
      load(e) {
        console.log("지도초기화!!");
      },

      click(e) {
        const mapLocate = map.locate();
        // console.log("바운더리 (북동 / 남서): ", clickEvent.getBounds());
        // console.log("현재 지도의 중심: ", clickEvent.getCenter());
        // console.log(
        //   "현재, 최소, 최대 zoom : ",
        //   clickEvent.getZoom(),
        //   clickEvent.getMinZoom(),
        //   clickEvent.getMaxZoom()
        // );
        //console.log("클릭된 위치 : ", e.latlng);

        setClickLatLng(e.latlng);
        setCenterLatLng(mapLocate.getCenter());
      },

      // 지리적 위치( locate메서드 사용)가 성공적으로 수행되면 실행됩니다.
      locationfound(e) {
        // console.log(
        //   "사용자 위치를 확인하는 locationFound 이벤트 발생 : ",
        //   e,
        //   map.getZoom()
        // );
        // 부드러운 팬-줌 애니메이션을 수행하는 지도 보기(지리적 중심 및 확대/축소)를 설정합니다.
        // map.flyTo(clickLatLng, map.getZoom());
        // map.flyTo(e.latlng, map.getZoom());
      },

      autopanstart(e) {
        console.log("팝업을 열 때 지도가 자동 이동을 시작하면 시작됩니다.", e);
      },

      // 지도 보기가 변경되기 시작할때
      movestart(e) {
        console.log("움직이기 시작!!");
      },

      move(e) {
        // 이거하면 애니메이션이 뚝뚝 끊겨서 보임
        // const moveEvent = map.locate();
        // const currentMapCenter = moveEvent.getCenter();
        // setCenterLatLng(currentMapCenter);
      },

      // 지도 중심이 변경되지 않으면 시작됩니다(예: 사용자가 지도 드래그를 중지했거나 중심에서 벗어나 확대/축소한 후).
      moveend(e) {
        const moveEvent = map.locate();
        const currentMapCenter = moveEvent.getCenter();
        console.log("움직이기 종료!!", currentMapCenter);

        // setTimeout(() => {
        //   // 클러스터 애니메이션을 다 보고 움직이고 싶으면 0.5초 정도 간격을 주고 실행
        // setCenterLatLng(currentMapCenter);
        // }, 500);
      },

      // 팝업 열릴 때 실행
      popupopen(e) {
        // 클릭한 팝업의 좌표
        const flyTargetLatLng = e.popup.getLatLng();
        if (flyTargetLatLng) {
          // 이거 클릭한건 markerData에 있는 latlng와 동일
          console.log("flyTargetLatLng", flyTargetLatLng);
          map.flyTo(flyTargetLatLng, map.getZoom());
        }
      },

      // 팝업 닫힐 때 실행
      popupclose(e) {
        console.log("닫힘!!");
      },
    });

    return (
      <>
        {markers.map((marker: any, idx: number) => {
          return (
            <Marker
              position={marker.geoCode}
              icon={customIcon}
              key={idx}
              title={marker.popup}
            >
              <Popup>
                <div>
                  <div className={"title"}>Hello Popup</div>
                  <div className={"desc"}>THIS IS</div>
                  <div className={"desc"}>{marker.popup}</div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </>
    );
  };

  return (
    <>
      {isMount ? (
        <div className="map_wrap">
          <section className="section">
            <div className={styles.section_top}>
              {/* 현재 클릭된 점의 좌표 */}
              <div className={styles.event_desc}>
                <span className={styles.desc_title}>지도 클릭좌표</span>
                <span className={styles.desc_value}>
                  {clickLatLng
                    ? `: ${clickLatLng.lat} : ${clickLatLng.lng}`
                    : ": 클릭되지 않음"}
                </span>
              </div>

              {/* 현재 중심좌표 */}
              <div className={styles.event_desc}>
                <span className={styles.desc_title}>지도 중심좌표</span>
                <span className={styles.desc_value}>
                  {centerLatLng
                    ? `: 위도 : ${centerLatLng.lat} : ${centerLatLng.lng}`
                    : ": 중심좌표가 설정되지 않음"}
                </span>
              </div>
            </div>
            <div className={styles.section_bottom}>
              <div className={styles.event_btn_box}></div>
            </div>
          </section>
          <MapContainer
            // https://leafletjs.com/reference.html#map-methods-for-getting-map-state
            center={position}
            zoom={13}
            minZoom={12}
            maxZoom={16}
            zoomControl={true}
            scrollWheelZoom={true}
            closePopupOnClick={true}
            // zoomSnap={2}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* leaflet skin이라고 검색하고 끼워넣으면 됨 */}
            {/* <TileLayer
            attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
          /> */}
            {/* 특정 줌 이하가 되면 몇건이 모여있는지 표시함 */}
            <MarkerClusterGroup
              chunkedLoading
              iconCreateFunction={createCustomClusterIcon}
            >
              <DrawingAndListingMarker markers={markers} />;
            </MarkerClusterGroup>
          </MapContainer>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default MapComponent;
