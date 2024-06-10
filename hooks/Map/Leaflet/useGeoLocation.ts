"use client";
import { useEffect, useLayoutEffect, useState } from "react";

/**
 * @useGeoLocation : 현재 위치를 반환해주는 함수
 * @returns location
 */
const useGeoLocation = () => {
  const [location, setLocation] = useState({
    loaded: false,
    coordinates: { lat: "", lng: "'" },
  });

  const onSuccess = (location: GeolocationPosition) => {
    console.log("onSuccess location is ", location);
    setLocation({
      loaded: true,
      coordinates: {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      },
    });
  };

  const onError = (error) => {
    setLocation({
      loaded: false,
      error,
    });
  };

  useLayoutEffect(() => {
    if (!("geolocation" in navigator)) {
      setLocation((prev) => {
        return {
          ...prev,
          loaded: true,
          error: {
            code: 500,
            message:
              "위치 정보를 불러오는 데 실패했습니다. 위치 정보를 요청한 페이지가 https 환경인지 위치정보 동의를 수락했는지 확인해주세요.",
          },
        };
      });
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  }, []);

  return location;
};

export default useGeoLocation;
