"use client";
import { useEffect, useRef, useState } from "react";
import {
  LayersControl,
  MapContainer,
  Polygon,
  Popup,
  Rectangle,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

// leaflet은 css가 필요함
import "./MapComponent.scss";
import {
  DivIcon,
  Icon,
  LatLngBoundsExpression,
  LatLngLiteral,
  LatLngTuple,
  point,
} from "leaflet";
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
import { gimhaeJSON } from "../Hole/kimhaeGeoJson";
import "./holeLeaflet.scss";
import {
  calculateRectangleBounds,
  DensityInterface,
  populationDensityData,
} from "./populationDensityData";

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
  const [gridList, setGridList] = useState<DensityInterface[]>([]);

  const gimhaeData = {
    ...Object.values(gimhaeJSON.features).map((features) => features)[0]
      .geometry,
  }.coordinates;

  const gridPattrenData = populationDensityData.map((data, idx) => {
    return {
      ...data,
    };
  });

  useEffect(() => {
    const newTypeGimhaeData = gimhaeData.map((oneDepthData) => {
      return oneDepthData.map((twoDepthData) => {
        return {
          lat: twoDepthData[1],
          lng: twoDepthData[0],
        };
      });
    });

    setBgPolygonList([...bgPolygonList, ...newTypeGimhaeData]);

    const newGridData = gridPattrenData.map((data) => ({
      ...data,
      // center: calculateRectangleBounds(data.center),
    }));

    setGridList(newGridData);
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

  function LocationRectangle() {
    const greenOptions = { fillColor: "green", storke: true };
    console.log(gridList);

    return (
      <div style={{ zIndex: 100 }}>
        {gridList.map((oneDepthPolygonList: any, idx: number) => {
          const bounds: any = calculateRectangleBounds(
            oneDepthPolygonList.center
          );

          return (
            <>
              <Rectangle
                interactive={true}
                key={idx}
                bounds={bounds}
                pathOptions={greenOptions}
                className="leaflet-interactive"
                eventHandlers={{
                  click: (e) => {
                    console.log("e is ", e);
                  },
                  mouseover: (e) => {
                    console.log("mouseover is ", e);

                    e.target.setStyle({
                      ...greenOptions,
                    });
                  },
                  mouseout: (e) => {
                    console.log("mouse out is ", e);
                    e.target.setStyle({
                      ...greenOptions,
                    });
                  },
                }}
              ></Rectangle>
              ;
            </>
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
              <LocationRectangle />
            </MapContainer>
          </div>
        </>
      )}
    </>
  );
};

export default MapComponent;
