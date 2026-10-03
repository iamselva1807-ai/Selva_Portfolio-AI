import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name} — ${site.role}`;

/**
 * Social card. Rendered by Satori, which supports only a flexbox subset of
 * CSS: every element with more than one child carries an explicit
 * `display: "flex"` and `flexDirection`, all colours are literal hex, and no
 * external font or image is fetched.
 */

/** Constellation nodes, in the 1200x630 canvas coordinate space. */
const nodes = [
  { x: 882, y: 138, r: 5 },
  { x: 1012, y: 96, r: 7 },
  { x: 1122, y: 176, r: 4 },
  { x: 958, y: 232, r: 6 },
  { x: 1074, y: 292, r: 4 },
  { x: 846, y: 266, r: 4 },
];

const edges = [
  [0, 1],
  [1, 2],
  [0, 3],
  [3, 4],
  [2, 4],
  [0, 5],
  [5, 3],
] as const;

export default function OpengraphImage() {
  const nameLines = site.name.toUpperCase().split(" ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          padding: "68px 80px",
          backgroundColor: "#050507",
          backgroundImage:
            "radial-gradient(900px circle at 62% -10%, #123a46 0%, #0a1620 38%, #050507 72%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Constellation motif */}
        <svg
          width={size.width}
          height={size.height}
          viewBox="0 0 1200 630"
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          {edges.map(([a, b]) => (
            <line
              key={`${a}-${b}`}
              x1={nodes[a].x}
              y1={nodes[a].y}
              x2={nodes[b].x}
              y2={nodes[b].y}
              stroke="#14758c"
              strokeWidth="1.5"
            />
          ))}
          {nodes.map((n, i) => (
            <circle
              key={i}
              cx={n.x}
              cy={n.y}
              r={n.r}
              fill={i === 1 || i === 3 ? "#35c8e8" : "#1f8ca6"}
            />
          ))}
        </svg>

        {/* Top rule */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontSize: 24,
              letterSpacing: "0.34em",
              color: "#a7adb8",
              fontWeight: 600,
            }}
          >
            {site.initials}
          </div>
          <div
            style={{
              fontSize: 20,
              letterSpacing: "0.26em",
              color: "#707784",
            }}
          >
            {site.location.toUpperCase()}
          </div>
        </div>

        {/* Name + role */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {nameLines.map((line) => (
            <div
              key={line}
              style={{
                fontSize: 104,
                lineHeight: 1.04,
                letterSpacing: "-0.045em",
                color: "#f5f7fa",
                fontWeight: 700,
              }}
            >
              {line}
            </div>
          ))}

          <div
            style={{
              width: 92,
              height: 3,
              marginTop: 34,
              backgroundColor: "#35c8e8",
            }}
          />

          <div
            style={{
              marginTop: 26,
              fontSize: 27,
              letterSpacing: "0.2em",
              color: "#35c8e8",
              fontFamily: "monospace",
            }}
          >
            {site.role.toUpperCase()}
          </div>
        </div>

        {/* Bottom rule */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #1c1f28",
            paddingTop: 26,
          }}
        >
          <div
            style={{
              fontSize: 20,
              letterSpacing: "0.1em",
              color: "#707784",
              fontFamily: "monospace",
            }}
          >
            {site.url.replace("https://", "")}
          </div>
          <div
            style={{
              fontSize: 20,
              letterSpacing: "0.22em",
              color: "#4e5562",
              fontFamily: "monospace",
            }}
          >
            PORTFOLIO
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
