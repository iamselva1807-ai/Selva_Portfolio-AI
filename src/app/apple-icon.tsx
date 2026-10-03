import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export const alt = "Selvakumar Manoharan";

/** Home-screen icon for iOS, which ignores SVG favicons. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#050507",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 104,
            height: 104,
            borderRadius: 999,
            border: "2px solid #1c2630",
            background: "radial-gradient(circle at 50% 50%, #0c2b33 0%, #050507 70%)",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 36,
              height: 36,
              borderRadius: 999,
              background: "#35c8e8",
            }}
          />
        </div>
      </div>
    ),
    size,
  );
}
