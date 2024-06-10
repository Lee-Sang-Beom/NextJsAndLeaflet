import dynamic from "next/dynamic";

const DynamicMapComponent = dynamic(
  () => import("@/components/Map/MapComponent"),
  {
    ssr: false,
  }
);

export default function Page() {
  return <DynamicMapComponent />;
}
