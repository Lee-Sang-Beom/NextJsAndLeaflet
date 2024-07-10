"use client";
import { LatLngLiteral } from "leaflet";
import { useEffect, useLayoutEffect, useState } from "react";

export interface GeoLocationProps {
  /**
   * @loaded : 데이터 로드여부
   */
  loaded: boolean;
  /**
   * @coordinates : 사용자 좌표
   */
  coordinates: LatLngLiteral | null;
  /**
   * @error : error Msg
   */
  error?: {
    code: number;
    message: string;
  };
}
/**
 * @useGeoLocation : 현재 위치를 반환해주는 함수
 * @returns location
 */
const useGeoLocation = () => {
  const [location, setLocation] = useState<GeoLocationProps>({
    loaded: false,
    coordinates: null,
  });

  /**
   * @onSuccess : 사용자 위치 로드 성공 시 error는 undefined, coordinates 값 추가
   */
  const onSuccess = (location: GeolocationPosition) => {
    setLocation({
      loaded: true,
      coordinates: {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      },
      error: undefined,
    });
  };

  /**
   * @onError : 사용자 위치 로드 실패 시 error 추가, coordinates 값 null
   */
  const onError = (error: GeolocationPositionError) => {
    setLocation({
      loaded: false,
      coordinates: null,
      error: {
        code: error.code,
        message: error.message,
      },
    });
  };

  /**
   * @useLayoutEffect : 사용자 위치 로드 시도
   */
  useLayoutEffect(() => {
    if (!("geolocation" in navigator)) {
      setLocation((prev) => {
        return {
          loaded: false,
          coordinates: null,
          error: {
            code: 500,
            message:
              "위치 정보를 불러오는 데 실패했습니다. 위치 정보를 요청한 페이지가 https 환경인지, 혹은 위치정보 동의를 수락했는지 확인해주세요.",
          },
        };
      });
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  }, []);

  return location;
};

export default useGeoLocation;
