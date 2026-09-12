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
          background: "#f7f3ea",
          color: "#241a13",
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
            border: "2px solid #b8863a",
            background: "rgba(184,134,58,0.1)",
            color: "#7a2418",
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
        <div style={{ display: "flex", fontSize: 28, color: "#6b5c48", marginTop: 16 }}>
          Steady counsel, clearly communicated.
        </div>
      </div>
    ),
    { ...size }
  );
}
