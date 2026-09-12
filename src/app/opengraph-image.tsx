import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/site-config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b1420",
          color: "#edf4ff",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 96,
            height: 96,
            borderRadius: "50%",
            border: "2px solid #5ec99a",
            background: "rgba(94,201,154,0.1)",
            color: "#5ec99a",
            fontSize: 40,
            fontFamily: "serif",
            marginBottom: 32,
          }}
        >
          P
        </div>
        <div style={{ display: "flex", fontSize: 56, fontFamily: "serif" }}>
          {SITE_NAME}
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#a9b8ac", marginTop: 16 }}>
          Steady counsel, clearly communicated.
        </div>
      </div>
    ),
    { ...size }
  );
}
