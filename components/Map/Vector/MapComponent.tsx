"use client";
import { useEffect, useRef, useState } from "react";
import {
  FeatureGroup,
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
   * @position : 창원 시청 중심좌표
   */
  const position = { lat: 35.22783, lng: 128.679315 };

  const customIcon = new Icon({
    iconUrl: "/img/marker.svg",
    iconSize: [24, 24],
    // iconAnchor: [17, x46],
    popupAnchor: [0, -20],
  });

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

  const _created = (e: any) => console.log(e);

  return (
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

                    mapObj.flyTo(loadLocation?.coordinates, mapObj.getZoom());
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
          center={position}
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
          <FeatureGroup>
            <EditControl
              position="topright"
              onCreated={_created}
              draw={{
                rectangle: true,
                circle: true,
                circlemarker: true,
                marker: true,
                polygon: true,
                polyline: true,
              }}
            />
          </FeatureGroup>

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
