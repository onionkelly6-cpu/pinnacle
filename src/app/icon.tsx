import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Matches the "Scale" mark used as the site logo in the header, footer,
// and splash screen (lucide-react's `Scale` icon), so the browser tab
// icon is the same mark instead of a separate design.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f7f3ea",
          border: "1px solid #b8863a",
          borderRadius: "50%",
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#7a2418"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3v18" />
          <path d="m19 8 3 8a5 5 0 0 1-6 0zV7" />
          <path d="M3 7h1a17 17 0 0 0 8-2 17 17 0 0 0 8 2h1" />
          <path d="m5 8 3 8a5 5 0 0 1-6 0zV7" />
          <path d="M7 21h10" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
