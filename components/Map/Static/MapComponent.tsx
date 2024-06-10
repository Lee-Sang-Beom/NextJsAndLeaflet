"use client";
import { useEffect, useRef, useState } from "react";
import {
  FeatureGroup,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
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

const MapComponent = () => {
  const mapRef = useRef<any>(null);
  const customIcon = new Icon({
    iconUrl: "/img/marker.svg",
    iconSize: [24, 24],
    // iconAnchor: [17, 46],
    popupAnchor: [0, -20],
  });

  const interactionOptions = {
    zoomControl: false,
    doubleClickZoom: false,
    closePopupOnClick: false,
    dragging: false,
    zoomSnap: undefined,
    zoomDelta: undefined,
    trackResize: false,
    touchZoom: false,
    scrollWheelZoom: false,
  };

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

  return (
    <>
      {loadLocation && loadLocation.coordinates && (
        <div className="map_wrap">
          {/* 뭔가를 추가할 때마다 저작권 창에 하나씩 뭔가 추가가됨 */}
          <MapContainer
            center={loadLocation.coordinates}
            zoom={DEFAULT_LEAFLET_ZOOM_LEVEL}
            minZoom={DEFAULT_LEAFLET_ZOOM_MIN_ZOOM}
            maxZoom={DEFAULT_LEAFLET_ZOOM_MAX_ZOOM}
            ref={mapRef}
            className="static-map"
            {...interactionOptions}
          >
            <TileLayer
              attribution={baseOSMProvider.maptiler.atttribution}
              url={baseOSMProvider.maptiler.url}
            />

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
      )}
    </>
  );
};

export default MapComponent;
