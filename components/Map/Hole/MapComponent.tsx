"use client";
import { useEffect, useRef, useState } from "react";
import {
  LayersControl,
  MapContainer,
  Polygon,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

// leaflet은 css가 필요함
import "./MapComponent.scss";
import styles from "./MapComponent.module.scss";
import { DivIcon, Icon, LatLngLiteral, LatLngTuple, point } from "leaflet";
import L from "leaflet";
import "leaflet-easyprint";

import {
  DEFAULT_LEAFLET_ZOOM_LEVEL,
  DEFAULT_LEAFLET_ZOOM_MAX_ZOOM,
  DEFAULT_LEAFLET_ZOOM_MIN_ZOOM,
  baseOSMProvider,
} from "@/utils/Map/Leaflet/osmProvider";
import useGeoLocation, {
  GeoLocationProps,
} from "@/hooks/Map/Leaflet/useGeoLocation";
import "leaflet-draw/dist/leaflet.draw.css";
import { gimhaeDongJSON, gimhaeJSON } from "./kimhaeGeoJson";
import "./holeLeaflet.scss";

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
 * @참고자료3 : https://apis.map.kakao.com/web/sample/donut/
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

  /**
   * polygon 데이터
   */
  const [bgPolygonList, setBgPolygonList] = useState<LatLngLiteral[][]>([
    [
      { lat: 34, lng: 125 }, // 왼쪽아래 꼭지점
      { lat: 34, lng: 131 }, // 우측아래 꼭지점
      { lat: 39, lng: 131 }, // 우측위 꼭지점
      { lat: 39, lng: 125 }, // 왼쪽위 꼭지점
    ],
  ]);
  const [mainPolygonList, setMainPolygonList] = useState<LatLngLiteral[][][][]>(
    []
  );

  const gimhaeData = {
    ...Object.values(gimhaeJSON.features).map((features) => features)[0]
      .geometry,
  }.coordinates;

  const gimhaeDongData = Object.values(gimhaeDongJSON.features)
    .filter((features) => features.properties.src_signgu_code == "48250")
    .map((features) => features.geometry.coordinates);
  // const allPath: LatLngTuple[] = [
  //   [34, 125], // 남서 (lat: 남(값이 작아질수록 아래로감), lng: 서(값이 작아질수록 왼쪽으로감))
  //   [39, 131], // 북동 (lat: 북(값이 커질수록 위로감), lng : 동(값이 커질수록 오른쪽으로감))
  // ];

  useEffect(() => {
    const newTypeGimhaeData = gimhaeData.map((oneDepthData) => {
      return oneDepthData.map((twoDepthData) => {
        return {
          lat: twoDepthData[1],
          lng: twoDepthData[0],
        };
      });
    });

    const newTypeGimhaeDongData = gimhaeDongData.map((oneDepthData) => {
      return oneDepthData.map((twoDepthData) => {
        return twoDepthData.map((threeDepthData) => {
          return threeDepthData.map((fourDepthData) => {
            return {
              lat: fourDepthData[1],
              lng: fourDepthData[0],
            };
          });
        });
      });
    });

    setBgPolygonList([...bgPolygonList, ...newTypeGimhaeData]);
    setMainPolygonList(newTypeGimhaeDongData);
  }, []);

  const BasePolygon = () => {
    const allPathOption = { fillColor: "black", opacity: 0 };

    return (
      <Polygon
        interactive={false}
        bubblingMouseEvents={false}
        positions={bgPolygonList}
        pathOptions={allPathOption}
        className="base-polygon"
        eventHandlers={{
          click: (e) => {
            e.originalEvent.stopPropagation();
          },
          mouseover: (e) => {
            e.originalEvent.stopPropagation();
          },
          mouseout: (e) => {
            e.originalEvent.stopPropagation();
          },
        }}
      />
    );
  };

  function LocationPolygon() {
    const mainPathOption = {
      stroke: true,
      color: "blue",
      fill: true,
      fillColor: "white",
    };

    // const map = useMapEvents({
    //   click(e) {
    //     console.log("e is ", e);
    //   },
    //   locationfound(e) {},
    // });
    return (
      <div style={{ zIndex: 100 }}>
        {mainPolygonList.map((oneDepthPolygonList: any, idx1: number) => {
          return oneDepthPolygonList.map(
            (twoDepthPolygonList: any, idx2: number) => {
              return (
                <Polygon
                  interactive={true}
                  positions={twoDepthPolygonList}
                  pathOptions={mainPathOption}
                  key={`idx1_${idx1}_idx2_${idx2}`}
                  className="leaflet-interactive"
                  eventHandlers={{
                    click: (e) => {
                      console.log("e is ", e);
                    },
                    mouseover: (e) => {
                      console.log("mouseover is ", e);

                      e.target.setStyle({
                        ...mainPathOption,
                        fillColor: "red",
                      });
                    },
                    mouseout: (e) => {
                      console.log("mouse out is ", e);
                      e.target.setStyle({
                        ...mainPathOption,
                      });
                    },
                  }}
                >
                  <Popup>
                    polygon 테스트 : {`${idx1} mainList in ${idx2}`}
                  </Popup>
                </Polygon>
              );
            }
          );
        })}
      </div>
    );
  }

  return (
    <>
      {loadLocation && loadLocation.coordinates && (
        <>
          <div className="map_wrap">
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

              <BasePolygon />
              <LocationPolygon />
            </MapContainer>
          </div>
        </>
      )}
    </>
  );
};

export default MapComponent;
