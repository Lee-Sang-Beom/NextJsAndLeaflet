import dynamic from "next/dynamic";

/**
 * react-leaflet은 기본적으로 SSR을 지원하지 않음.
 * 기본적으로 SSR을 지원하는 Next.js 프레임워크에서 CSR 방식으로 해당 컴포넌트를 렌더링하는 작업이 필요함
 */
const DynamicMapComponent = dynamic(
  () => import("@/components/Map/MapComponent"),
  {
    ssr: false,
  }
);

export default function Page() {
  return <DynamicMapComponent />;
}
