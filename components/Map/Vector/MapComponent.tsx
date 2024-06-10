"use client";
import { useEffect, useRef, useState } from "react";
import {
  Circle,
  CircleMarker,
  FeatureGroup,
  MapContainer,
  Marker,
  Polygon,
  Polyline,
  Popup,
  Rectangle,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

// leaflet은 css가 필요함
import "./MapComponent.scss";
import styles from "./MapComponent.module.scss";
import { DivIcon, Icon, LatLng, icon, point, polygon } from "leaflet";
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
import { EditControl } from "react-leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";

Icon.Default.mergeOptions({
  // iconRetinaUrl: "",
  iconUrl: "/img/catMarker.jpg",
  iconSize: [40, 60],
  // shadowUrl: "",
});
/**
 *
 * @참고자료1 : https://leafletjs.com/reference.html
 * @참고자료2 : https://react-leaflet.js.org/docs/example-vector-layers/
 */
const MapComponent = () => {
  const mapRef = useRef<any>(null);

  /**
   * 사용자 위치 정보를 불러오는 useGeoLocation hooks 사용
   */
  const [loadLocation, setLoadLocation] = useState<GeoLocationProps | null>(
    null
  );
  const location = useGeoLocation();
  useEffect(() => {
    if (location) {
      setLoadLocation(location);
    }
  }, [location]);

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

  const polyLineList = [
    { lat: 35.2329, lng: 128.68222982315095 },
    { lat: 35.23285, lng: 128.6722 },
    { lat: 35.226360785943285, lng: 128.6722 },
    { lat: 35.24042520806185, lng: 128.64925766494147 },
    { lat: 35.240199191938146, lng: 128.64898093505852 },
  ];
  const multiPolyLineList = [
    [
      { lat: 35.4329, lng: 128.62222982315095 },
      { lat: 35.43285, lng: 128.6622 },
      { lat: 35.426360785943285, lng: 128.6622 },
      { lat: 35.44042520806185, lng: 128.63925766494147 },
      { lat: 35.440199191938146, lng: 128.63898093505852 },
    ],
    [
      { lat: 35.3329, lng: 128.65222982315095 },
      { lat: 35.33285, lng: 128.6022 },
      { lat: 35.326360785943285, lng: 128.6022 },
      { lat: 35.34042520806185, lng: 128.60925766494147 },
      { lat: 35.340199191938146, lng: 128.60898093505852 },
    ],
  ];

  // leaflet의 polygon은 자동으로 마지막 lat/lng에서 처음 좌표를 이어준다
  const polygon = [
    { lat: 35.5, lng: 128.6732982315095 },
    { lat: 35.53285, lng: 128.6722 },
    { lat: 35.54042520806185, lng: 128.61925766494147 },
    { lat: 35.540199191938146, lng: 128.602 },
  ];

  const fillBlueOptions = { fillColor: "blue", weight: 8 };
  const blackOptions = { color: "black", weight: 8 };
  const limeOptions = { color: "lime", weight: 8 };
  const cyanOptions = { color: "cyan", weight: 8 };
  const purpleOptions = { color: "purple", weight: 8 };
  const redOptions = { color: "red", weight: 8 };

  return (
    <>
      {loadLocation && loadLocation.coordinates && (
        <>
          <div className="map_wrap">
            <section className="section">
              <div className={styles.section_top}>
                <div className={styles.event_desc}></div>
                <div className={styles.event_desc}></div>
              </div>
              <div className={styles.section_bottom}>
                <div className={styles.event_btn_box}>
                  <button
                    onClick={() => {
                      if (mapRef && mapRef.current) {
                        const mapObj = mapRef.current.locate();

                        mapObj.flyTo(
                          loadLocation?.coordinates,
                          mapObj.getZoom()
                        );
                      }
                    }}
                  >
                    현재 위치로 이동
                  </button>
                </div>
              </div>
            </section>

            <MapContainer
              center={loadLocation?.coordinates}
              zoom={DEFAULT_LEAFLET_ZOOM_LEVEL}
              minZoom={DEFAULT_LEAFLET_ZOOM_MIN_ZOOM}
              maxZoom={DEFAULT_LEAFLET_ZOOM_MAX_ZOOM}
              zoomControl={true}
              scrollWheelZoom={true}
              closePopupOnClick={true}
              ref={mapRef}
            >
              <TileLayer
                attribution={baseOSMProvider.maptiler.atttribution}
                url={baseOSMProvider.maptiler.url}
              />

              {/* 추가 1: 현재 좌표를 기준으로 300m */}
              <Circle
                center={loadLocation.coordinates}
                pathOptions={fillBlueOptions}
                radius={300}
              >
                <Popup>300m 테스트</Popup>
              </Circle>

              {/* 추가 2: 현재 좌표를 기준으로 200 픽셀 (m값 아님) */}
              <CircleMarker
                center={loadLocation.coordinates}
                pathOptions={redOptions}
                radius={200}
              >
                <Popup>200 픽셀 테스트</Popup>
              </CircleMarker>

              <Polyline pathOptions={blackOptions} positions={polyLineList} />
              <Polyline
                pathOptions={cyanOptions}
                positions={multiPolyLineList}
              />
              <Polygon pathOptions={purpleOptions} positions={polygon} />
              {/* <Polygon pathOptions={purpleOptions} positions={multiPolygon} /> */}
              {/* <Rectangle bounds={rectangle} pathOptions={blackOptions} /> */}
            </MapContainer>
          </div>
        </>
      )}
    </>
  );
};

export default MapComponent;
