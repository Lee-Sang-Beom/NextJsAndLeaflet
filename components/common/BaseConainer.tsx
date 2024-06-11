export default function BaseContainer({ children }: any) {
  return (
    <div
      style={{
        padding: "10px",
        border: "1px solid red",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          marginBottom: "10px",
        }}
      >{`홈 > 관리자 > 조직도`}</div>
      {children}
    </div>
  );
}
