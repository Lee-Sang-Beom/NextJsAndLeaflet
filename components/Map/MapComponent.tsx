"use client";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// leaflet은 css가 필요함!
import "./MapComponent.scss";
import { Icon } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

const MapComponent = () => {
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
      popup: "취급업체 1",
    },
    {
      geoCode: { lat: 35.226360785943285, lng: 128.68222982315095 },
      popup: "창원시청",
    },
  ];

  const customIcon = new Icon({
    iconUrl: "/img/marker.svg",
    iconSize: [24, 24],
  });
  return (
    <>
      {window ? (
        <MapContainer center={position} zoom={13} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=p3ehrajjy5&callback=initMap"
          />

          {/* 특정 줌 이하가 되면 몇건이 모여있는지 표시함 */}
          <MarkerClusterGroup>
            {markers.map((marker, idx) => {
              return (
                <Marker
                  position={marker.geoCode}
                  icon={customIcon}
                  key={idx.toString()}
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
          </MarkerClusterGroup>
        </MapContainer>
      ) : (
        <></>
      )}
    </>
  );
};

export default MapComponent;
