import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 600
};

export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "56px",
        background: "linear-gradient(135deg, #090614 0%, #070513 52%, #0b1024 100%)",
        color: "white"
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 24,
          color: "#67e8f9",
          marginBottom: 18
        }}
      >
        Next.js Boilerplate
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 64,
          fontWeight: 700,
          lineHeight: 1.06,
          letterSpacing: -1.8
        }}
      >
        PostgreSQL + Drizzle
      </div>
    </div>,
    size
  );
}
