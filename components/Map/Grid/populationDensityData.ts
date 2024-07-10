import { LatLngLiteral } from "leaflet";

// 150m * 150m 격자 데이터를 생성합니다.
const baseLat = 35.27413522841792;
const baseLng = 128.8133340464167;
export const delta = 150; // 약 150m

export const calculateRectangleBounds = (center: LatLngLiteral) => {
  // 150m를 경위도로 변환
  const earthRadius = 6378137; // 지구 반지름 (미터)
  const latRadian = (center.lat * Math.PI) / 180;

  // 경위도 간의 거리 계산 공식을 사용하여 150m를 경위도로 환산
  const deltaLat = (delta / earthRadius) * (180 / Math.PI);
  const deltaLng =
    (delta / (earthRadius * Math.cos(latRadian))) * (180 / Math.PI);

  // Rectangle의 bounds 계산
  const bounds = [
    [center.lat - deltaLat / 2, center.lng - deltaLng / 2], // 남서 좌표
    [center.lat + deltaLat / 2, center.lng + deltaLng / 2], // 북동 좌표
  ];

  return bounds;
};

export const populationDensityData = Array.from({ length: 100 }, (_, i) => {
  const row = Math.floor(i / 10);
  const col = i % 10;

  const centerLat = baseLat + row * (delta / 111320); // 111320m는 1도 위도에 해당하는 거리
  const centerLng =
    baseLng + col * (delta / (111320 * Math.cos((baseLat * Math.PI) / 180))); // 경도 보정

  return {
    idx: i,
    center: { lat: centerLat, lng: centerLng },
    density: Math.floor(Math.random() * 2000), // 무작위 인구 밀도 (0 ~ 2000)
  };
});

// export const populationDensityData = Array.from({ length: 100 }, (_, i) => {
//   const row = Math.floor(i / 10);
//   const col = i % 10;
//   return {
//     idx: i,
//     center: [baseLat + row * delta, baseLng + col * delta],
//     density: Math.floor(Math.random() * 2000), // 무작위 인구 밀도 (0 ~ 2000)
//   };
// });

export interface DensityInterface {
  center: LatLngLiteral;
  density: number;
  idx: number;
}
