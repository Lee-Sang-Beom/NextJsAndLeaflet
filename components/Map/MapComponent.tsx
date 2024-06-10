"use client";
import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

// leaflet은 css가 필요함
import "./MapComponent.scss";
import styles from "./MapComponent.module.scss";
import { DivIcon, Icon, LatLng, point } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import {
  DEFAULT_LEAFLET_ZOOM_LEVEL,
  DEFAULT_LEAFLET_ZOOM_MAX_ZOOM,
  DEFAULT_LEAFLET_ZOOM_MIN_ZOOM,
  alidadeSmoothDarkOSMProvider,
  baseOSMProvider,
} from "@/utils/Map/Leaflet/osmProvider";
import useGeoLocation, {
  GeoLocationProps,
} from "@/hooks/Map/Leaflet/useGeoLocation";

/**
 *
 * @참고자료 : https://leafletjs.com/reference.html
 */
const MapComponent = () => {
  const mapRef = useRef<any>(null);
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
      popup: "팝업 데이터 1",
    },
    {
      geoCode: { lat: 35.226360785943285, lng: 128.68222982315095 },
      popup: "팝업 데이터 2",
    },
    {
      geoCode: { lat: 35.2329, lng: 128.68222982315095 },
      popup: "팝업 데이터 3",
    },
    {
      geoCode: { lat: 35.23285, lng: 128.6722 },
      popup: "팝업 데이터 4",
    },
    {
      geoCode: { lat: 35.226360785943285, lng: 128.6722 },
      popup: "팝업 데이터 5",
    },
    {
      geoCode: { lat: 35.24042520806185, lng: 128.64925766494147 },
      popup: "사용자 위치 바운딩박스 (북동)",
    },
    {
      geoCode: { lat: 35.240199191938146, lng: 128.64898093505852 },
      popup: "사용자 위치 바운딩박스 (남서)",
    },
  ];

  const customIcon = new Icon({
    iconUrl: "/img/marker.svg",
    iconSize: [24, 24],
    // iconAnchor: [17, 46], // icon 베이스 위치: [left/right, top/bottom]
    popupAnchor: [0, -20], // y축으로부터 20만큼 위로 이동한 곳에 마커 찍기
  });

  /**
   * @clickLatLng : 클릭된 점의 좌표
   * @centerLatLng : 지도 중심 좌표
   */
  const [clickLatLng, setClickLatLng] = useState<any | null>(null);
  const [centerLatLng, setCenterLatLng] = useState<any | null>(null);

  /**
   * 클러스터 아이콘 생성
   */
  const createCustomClusterIcon = (cluster: any) => {
    return new DivIcon({
      html: `<div class="cluster-icon">${cluster.getChildCount()}</div>`,
      className: "custom-marker-cluster",
      iconSize: point(33, 33, true),
      iconAnchor: [17, 46],
      popupAnchor: [3, -46],
    });
  };

  const DrawingAndListingMarker = ({ markers }: any) => {
    /**
     * 이벤트 property 설명
     * @type : 이벤트 유형 (click, popupopen 등)
     * @target : 이벤트를 발생시킨 개체. 전파된 이벤트의 경우 이벤트를 발생시킨 전파 체인의 마지막 개체
     * @sourceTarget : 이벤트를 발생시킨 개체. 원래 이벤트를 발생시킨 개체로, 전파되지 않은 이벤트의 경우 이는 target.
     * @propagatedFrom : 전파된 이벤트의 경우 이벤트를 상위 이벤트에 전파한 마지막 개체
     */

    /**
     * 이벤트 리스너
     *
     * @load : 지도가 초기화될 때(중심과 확대/축소가 처음으로 설정될 때) 실행
     * @click : 사용자가 지도를 클릭(또는 탭)하면 실행
     * @locationfound : 지리적 위치(locate method 사용) 로드가 성공적으로 수행되면 실행.
     * @autopanstart : 팝업을 열 때 지도가 자동 이동을 시작하면 실행
     * @movestart : 지도가 움직이기 시작할 때 실행
     * @move : 지도가 움직이는 동안 실행
     * @moveEnd : 지도가 움직인 후에 실행 (지도 중심이 변경되지 않으면 시작)
     * @popupopen : 팝업 열릴 때 실행
     * @popupclose : 팝업 닫힐 때 실행
     */
    const map = useMapEvents({
      load(e) {
        console.log("지도 초기화");
      },

      // MouseEvent 가짐
      // https://leafletjs.com/reference.html#locationevent 에서 (CTRL+F = MouseEvent 검색)
      click(e) {
        /**
         * @mapLocate : Geolocation API를 사용하여 사용자의 위치를 ​​찾으려고 시도한다.
         *  - locationfound 성공 시 위치 데이터가 포함된 이벤트를 발생
         *  - locationerror 실패 시 이벤트를 발생시키며 선택적으로 감지 정확도와 관련하여 지도 보기를 사용자 위치로 설정한다.
         *
         * @getBounds : 현재 지도 보기에 표시되는 지리적 경계를 반환 (북동 / 남서)
         *  - mapLocate.getBounds()
         *
         * @getCenter : 지도 중심 반환
         *  - mapLocate.getCenter()
         *
         * @getZoom @getMinZoom @getMaxZoom : 현재, 최소, 최대 zoomLevel 반환
         *  - mapLocate.getZoom(), mapLocate.getMinZoom(), mapLocate.getMaxZoom()
         */
        const mapLocate = map.locate();
        setCenterLatLng(mapLocate.getCenter());

        /**
         * @e : MouseEvent
         *
         * @latlng : MouseEvent에 속하는 객체이며, 이벤트가 발생한 지리적 지점 (위도/경도값)
         *  - e.latlng
         *
         * @containerPoint : MouseEvent에 속하는 객체이며, 지도 레이어를 기준으로 마우스 이벤트가 발생한 지점의 픽셀 좌표
         *  - e.containerPoint
         *
         * @containerPoint : MouseEvent에 속하는 객체이며, 지도 컨테이너를 기준으로 마우스 이벤트가 발생한 지점의 픽셀 좌표
         *  - e.containerPoint
         */
        setClickLatLng(e.latlng);
      },

      // LocationEvent 가짐
      // https://leafletjs.com/reference.html#locationevent 에서 (CTRL+F = LocationEvent 검색)
      locationfound(e) {
        /**
         * @e : LocationEvent
         *
         * @latlng : LocationEvent에 속하는 객체이며, 이벤트가 발생한 지리적 지점 (위도/경도값)
         *  - e.latlng
         *
         * @bounds : LocationEvent에 속하는 객체이며, 사용자가 위치한 지역의 바운딩 박스 반환
         *  - e.bounds
         *
         * @accuracy : 미터 단위의 위치 정확도
         *  - e.accuracy
         */
        const clickEventLatLng = e.latlng;

        /**
         * @flyTo : 지정한 위치로 자연스럽게 이동 (이동할 좌표 위치)
         *  - map.flyTo(clickLatLng, map.getZoom());
         */
      },

      // Event 가짐
      // https://leafletjs.com/reference.html#locationevent 에서 (CTRL+F = Event 검색)
      autopanstart(e) {},

      // Event 가짐
      // https://leafletjs.com/reference.html#locationevent 에서 (CTRL+F = Event 검색)
      movestart(e) {
        const moveEvent = map.locate();
        const currentMapCenter = moveEvent.getCenter();
        console.log("moveStart ", currentMapCenter);
      },

      // Event 가짐
      // https://leafletjs.com/reference.html#locationevent 에서 (CTRL+F = Event 검색)
      // 잦은 호출 때문에, 성능이 떨어질 수 있음
      move(e) {},

      // Event 가짐
      // https://leafletjs.com/reference.html#locationevent 에서 (CTRL+F = Event 검색)
      moveend(e) {
        const moveEvent = map.locate();
        const currentMapCenter = moveEvent.getCenter();
        console.log("moveEnd ", currentMapCenter);
      },

      // Event 가짐
      // https://leafletjs.com/reference.html#locationevent 에서 (CTRL+F = Event 검색)
      zoomstart(e) {
        const moveEvent = map.locate();
        const currentZoom = moveEvent.getZoom();
        console.log("zoomStart ", currentZoom);
      },

      // Event 가짐
      // https://leafletjs.com/reference.html#locationevent 에서 (CTRL+F = Event 검색)
      zoom(e) {},

      // Event 가짐
      // https://leafletjs.com/reference.html#locationevent 에서 (CTRL+F = Event 검색)
      zoomend(e) {
        const moveEvent = map.locate();
        const currentZoom = moveEvent.getZoom();
        console.log("zoomEnd ", currentZoom);
      },

      // PopupEvent 가짐
      // https://leafletjs.com/reference.html#locationevent 에서 (CTRL+F = PopupEvent 검색)
      popupopen(e) {
        /**
         * @e : PopupEvent
         *
         * @getLatLng : 팝업의 latLng이라기보다는 '마커'의 latLng을 가져오는 방법이다.
         *  - markerData에 있는 latlng 값이다.
         *  - 마커 클릭 시, 지도 중앙으로 오게 해야한다면 이걸 쓰면 된다.
         *  - e.popup.getLatLng()
         */

        const flyTargetLatLng = e.popup.getLatLng();
        if (flyTargetLatLng) {
          //  map.flyTo(flyTargetLatLng, map.getZoom());
        }
      },

      // Event 가짐
      // https://leafletjs.com/reference.html#locationevent 에서 (CTRL+F = Event 검색)
      popupclose(e) {},

      // LayerEvent 가짐
      // https://leafletjs.com/reference.html#locationevent 에서 (CTRL+F = LayerEvent 검색)
      layeradd(e) {
        /**
         * @getPopup : 이 레이어에 바인딩된 팝업을 반환
         *  - e.layer.getPopup()
         */
        const popup = e.layer.getPopup();
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
                <div className="popup_wrap">
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

  /**
   * 사용자 위치 정보를 불러오는 useGeoLocation hooks 사용
   */
  const [loadLocation, setLoadLocation] = useState<GeoLocationProps | null>(
    null
  );
  const location = useGeoLocation();
  useEffect(() => {
    setLoadLocation(location);
  }, [location]);

  return (
    <>
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
            <div className={styles.event_btn_box}>
              <button
                onClick={() => {
                  if (mapRef && mapRef.current) {
                    const mapObj = mapRef.current.locate();

                    mapObj.flyTo(loadLocation?.coordinates, mapObj.getZoom());
                    // console.log(
                    //   "mapObj is ",
                    //   mapObj.getCenter(),
                    //   mapObj.getZoom()
                    // );
                  }
                }}
              >
                현재 위치로 이동
              </button>
            </div>
          </div>
        </section>

        {/* 뭔가를 추가할 때마다 저작권 창에 하나씩 뭔가 추가가됨 */}
        <MapContainer
          // https://leafletjs.com/reference.html#map-methods-for-getting-map-state
          center={position}
          zoom={DEFAULT_LEAFLET_ZOOM_LEVEL}
          minZoom={DEFAULT_LEAFLET_ZOOM_MIN_ZOOM}
          maxZoom={DEFAULT_LEAFLET_ZOOM_MAX_ZOOM}
          zoomControl={true}
          scrollWheelZoom={true}
          closePopupOnClick={true}
          ref={mapRef}
          // zoomSnap={2}
        >
          <TileLayer
            attribution={baseOSMProvider.maptiler.atttribution}
            url={baseOSMProvider.maptiler.url}
          />

          {/* leaflet skin이라고 검색하고 끼워넣으면 됨 */}
          {/* <TileLayer
              attribution={alidadeSmoothDarkOSMProvider.maptiler.atttribution}
              url={alidadeSmoothDarkOSMProvider.maptiler.url}
            /> */}
          {/* 특정 줌 이하가 되면 몇건이 모여있는지 표시함 */}
          <MarkerClusterGroup
            chunkedLoading
            iconCreateFunction={createCustomClusterIcon}
          >
            <DrawingAndListingMarker markers={markers} />;
          </MarkerClusterGroup>

          {loadLocation && loadLocation.coordinates ? (
            <Marker
              position={loadLocation!.coordinates}
              icon={customIcon}
              title={"현재 위치"}
            >
              <Popup>
                <div className="popup_wrap">
                  <div className={"title"}>현재위치 표시입니다.</div>
                  <div className="desc">안녕하세요.</div>
                </div>
              </Popup>
            </Marker>
          ) : (
            <></>
          )}
        </MapContainer>
      </div>
    </>
  );
};

export default MapComponent;
