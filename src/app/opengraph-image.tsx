import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "64px",
        background: "linear-gradient(135deg, #090614 0%, #070513 52%, #0b1024 100%)",
        color: "white"
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 26,
          color: "#67e8f9",
          marginBottom: 20
        }}
      >
        Production-ready starter
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 72,
          fontWeight: 700,
          lineHeight: 1.05,
          letterSpacing: -2
        }}
      >
        Next.js Boilerplate
        <br />
        PostgreSQL + Drizzle
      </div>
    </div>,
    size
  );
}
