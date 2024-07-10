"use client";
import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

// leaflet은 css가 필요함
import "./MapComponent.scss";
import L, { Icon } from "leaflet";
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
import { statesData } from "./state";
import "./legend.scss";

// example : 미국 인구 밀도를 시각화하는 대화형 코로플레스 지도

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
 * @참고자료3(대화형 코로플레스 지도) : https://leafletjs.com/examples/choropleth/
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
   * 테스트 코드 시작
   */

  const [infoProps, setInfoProps] = useState<any>(null);
  let info: any = null;
  const geoJsonRef = useRef<any>(null); // Ref for GeoJSON layer

  function getColor(d: number): string {
    return d > 1000
      ? "#800026"
      : d > 500
      ? "#BD0026"
      : d > 200
      ? "#E31A1C"
      : d > 100
      ? "#FC4E2A"
      : d > 50
      ? "#FD8D3C"
      : d > 20
      ? "#FEB24C"
      : d > 10
      ? "#FED976"
      : "#FFEDA0";
  }

  function getStyle(feature: any) {
    return {
      fillColor: getColor(feature.properties.density),
      weight: 2,
      opacity: 1,
      color: "white",
      dashArray: "3",
      fillOpacity: 0.7,
    };
  }

  // 상호작용 : 지도 상의 특정 피처(예: 폴리곤)에 마우스가 올라갔을 때 그 피처를 강조하는 역할을 합니다. 이 함수는 Leaflet의 mouseover 이벤트 핸들러로 사용됩니다.
  function highlightFeature(e: any) {
    var layer = e.target;

    layer.setStyle({
      weight: 5,
      color: "#666",
      dashArray: "",
      fillOpacity: 0.7,
    });
    info.update(layer.feature.properties); // update 메소드를 호출하여, 현재 강조된 피처의 속성 정보를 업데이트합니다.
    layer.bringToFront(); // layer.bringToFront()은 해당 레이어를 다른 모든 레이어 위로 가져옵니다. 이는 피처가 강조될 때 다른 피처들보다 앞에 보이도록 하기 위함입니다.
  }

  function resetHighlight(e: any) {
    if (geoJsonRef.current) {
      geoJsonRef.current.resetStyle(e.target); // 스타일 리셋: 이 함수는 highlightFeature 함수에서 강조된 피처의 스타일을 원래 상태로 되돌립니다.
    }

    info.update(); // 정보 업데이트 초기화: 지도에 표시된 정보 컨트롤을 기본 상태로 초기화합니다.
  }

  function zoomToFeature(e: any) {
    console.log("e is ", e);
    mapRef.current.fitBounds(e.target.getBounds()); //  클릭된 피처의 경계(bounds)에 맞춰 지도를 확대하고 이동합니다. fitBounds 메소드는 지정된 경계에 맞춰 지도의 중심과 확대 수준을 조정합니다.
  }

  function onEachFeature(feature: any, layer: any) {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature,
    });
  }

  const Legend = () => {
    const map = useMap();

    useEffect(() => {
      const legend = new L.Control({ position: "bottomright" });

      legend.onAdd = function () {
        const div = L.DomUtil.create("div", "info legend");
        const grades = [0, 10, 20, 50, 100, 200, 500, 1000];
        const labels = [];

        for (let i = 0; i < grades.length; i++) {
          div.innerHTML +=
            '<i style="background:' +
            getColor(grades[i] + 1) +
            '"></i> ' +
            grades[i] +
            (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
        }

        return div;
      };

      legend.addTo(map);

      return () => {
        map.removeControl(legend);
      };
    }, [map]);

    return null;
  };

  const InfoControl = ({ infoProps }: { infoProps: any }) => {
    const map = useMap();

    useEffect(() => {
      // 사용자 정의 컨트롤 타입 정의
      info = new (L.Control.extend({
        onAdd: function () {
          const div = L.DomUtil.create("div", "info");
          (this as any)._div = div;
          this.update();
          return div;
        },
        update: function (props?: any) {
          console.log("props is ", props);
          (this as any)._div.innerHTML =
            "<h4>US Population Density</h4>" +
            (props
              ? "<b>" +
                props.name +
                "</b><br />" +
                props.density +
                " people / mi<sup>2</sup>"
              : "Hover over a state");
        },
      }))({ position: "topright" });

      info.addTo(map);
      info.update(infoProps);

      return () => {
        // @ts-ignore
        map.removeControl(info);
      };
    }, [map, infoProps]);

    return null;
  };

  /**
   * 테스트 코드 종료
   */
  return (
    <>
      {loadLocation && loadLocation.coordinates && (
        <>
          <div className="map_wrap">
            <MapContainer
              center={{
                lat: 35.00118,
                lng: -87.359296,
              }}
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
              <GeoJSON
                data={statesData}
                style={getStyle}
                onEachFeature={onEachFeature} // onEachFeature prop은 GeoJSON 컴포넌트의 각 개별 피처(폴리곤, 라인, 포인트 등)에 이벤트 핸들러를 설정하기 위해 사용됩니다. 이를 통해 각 피처에 대해 상호작용을 정의할 수 있습니다. 이 예제에서는 onEachFeature 함수가 폴리곤에 마우스를 올렸을 때 하이라이트하고, 마우스를 벗어났을 때 하이라이트를 해제하며, 클릭 시 해당 영역으로 지도를 확대하는 기능을 제공합니다.
                ref={geoJsonRef} // Attach the ref to GeoJSON
              />
              <Legend />
              <InfoControl infoProps={infoProps} />
            </MapContainer>
          </div>
        </>
      )}
    </>
  );
};

export default MapComponent;
