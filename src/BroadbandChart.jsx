import { useState, useEffect } from "react";

const regionData = [
  { region: "NCR", avgDays: 4.2 },
  { region: "CAR", avgDays: 9.8 },
  { region: "Region I", avgDays: 6.1 },
  { region: "Region II", avgDays: 11.4 },
  { region: "Region III", avgDays: 5.3 },
  { region: "Region IV-A", avgDays: 3.7 },
  { region: "Region IV-B", avgDays: 13.2 },
  { region: "Region V", avgDays: 10.5 },
  { region: "Region VI", avgDays: 7.9 },
  { region: "Region VII", avgDays: 5.8 },
  { region: "Region VIII", avgDays: 12.1 },
  { region: "Region IX", avgDays: 8.6 },
  { region: "Region X", avgDays: 6.4 },
  { region: "Region XI", avgDays: 4.9 },
  { region: "Region XII", avgDays: 9.2 },
  { region: "CARAGA", avgDays: 14.7 },
  { region: "BARMM", avgDays: 16.3 },
];

const grandMean =
  regionData.reduce((sum, d) => sum + d.avgDays, 0) / regionData.length;

const processed = regionData
  .map((d) => ({ ...d, deviation: +(d.avgDays - grandMean).toFixed(2) }))
  .sort((a, b) => a.deviation - b.deviation);

const maxAbs = Math.max(...processed.map((d) => Math.abs(d.deviation)));

export default function BroadbandChart() {
  const [hovered, setHovered] = useState(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  const BAR_MAX_PX = 220;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8F9FC",
        fontFamily: "'Georgia', serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "48px 24px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 48, maxWidth: 700 }}>
        <p
          style={{
            color: "#B45309",
            fontSize: 11,
            letterSpacing: 3,
            textTransform: "uppercase",
            margin: "0 0 12px",
            fontFamily: "monospace",
          }}
        >
          Descriptive Analytics · Case Study
        </p>
        <h1
          style={{
            color: "#1E293B",
            fontSize: "clamp(20px, 4vw, 32px)",
            fontWeight: 700,
            margin: "0 0 14px",
            lineHeight: 1.25,
            fontFamily: "'Georgia', serif",
            letterSpacing: -0.5,
          }}
        >
          Broadband Installation Time
          <br />
          <span style={{ color: "#B45309" }}>by Region vs. Average</span>
        </h1>
        <p
          style={{
            color: "#64748B",
            fontSize: 13,
            margin: 0,
            lineHeight: 1.7,
          }}
        >
          Average days from application to installation per Philippine region,
          measured as deviation from the overall mean of{" "}
          <span
            style={{
              color: "#0F172A",
              fontWeight: 700,
              background: "#F1F5F9",
              padding: "1px 6px",
              borderRadius: 4,
              border: "1px solid #E2E8F0",
              fontFamily: "monospace",
            }}
          >
            {grandMean.toFixed(1)} days
          </span>
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: 28,
          marginBottom: 36,
          fontSize: 12,
          color: "#64748B",
          letterSpacing: 1,
          fontFamily: "monospace",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span
            style={{
              display: "inline-block",
              width: 14,
              height: 14,
              borderRadius: 3,
              background: "#22C55E",
            }}
          />
          FASTER THAN AVG
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span
            style={{
              display: "inline-block",
              width: 14,
              height: 14,
              borderRadius: 3,
              background: "#EF4444",
            }}
          />
          SLOWER THAN AVG
        </span>
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: 860,
          background: "#FFFFFF",
          borderRadius: 16,
          border: "1px solid #E2E8F0",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          padding: "32px 28px 28px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 20,
            paddingLeft: 120,
          }}
        >
          <div
            style={{ flex: 1, height: 1, borderTop: "1px dashed #CBD5E1" }}
          />
          <span
            style={{
              color: "#94A3B8",
              fontSize: 10,
              letterSpacing: 2,
              fontFamily: "monospace",
            }}
          >
            MEAN
          </span>
          <div
            style={{ flex: 1, height: 1, borderTop: "1px dashed #CBD5E1" }}
          />
        </div>

        {processed.map((d, i) => {
          const isPos = d.deviation >= 0;
          const color = isPos ? "#EF4444" : "#22C55E";
          const barWidth = animated
            ? (Math.abs(d.deviation) / maxAbs) * BAR_MAX_PX
            : 0;
          const isHovered = hovered === d.region;

          return (
            <div
              key={d.region}
              onMouseEnter={() => setHovered(d.region)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 9,
                cursor: "default",
                transition: "opacity 0.2s",
                opacity: hovered && !isHovered ? 0.4 : 1,
              }}
            >
              <div
                style={{
                  width: 110,
                  textAlign: "right",
                  paddingRight: 14,
                  fontSize: 11,
                  color: isHovered ? "#0F172A" : "#475569",
                  letterSpacing: 0.5,
                  transition: "color 0.2s",
                  flexShrink: 0,
                  fontWeight: isHovered ? 700 : 400,
                  fontFamily: "monospace",
                }}
              >
                {d.region}
              </div>

              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                  height: 28,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: 0,
                    bottom: 0,
                    width: 1,
                    background: "#CBD5E1",
                    transform: "translateX(-50%)",
                    zIndex: 1,
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    right: "50%",
                    top: "50%",
                    transform: "translateY(-50%)",
                    height: 18,
                    width: !isPos ? barWidth : 0,
                    background: !isPos
                      ? `linear-gradient(to left, ${color}, ${color}99)`
                      : "transparent",
                    borderRadius: "4px 0 0 4px",
                    transition: "width 0.7s cubic-bezier(0.4,0,0.2,1)",
                    transitionDelay: `${i * 30}ms`,
                    boxShadow:
                      !isPos && isHovered ? `0 0 12px ${color}88` : "none",
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translateY(-50%)",
                    height: 18,
                    width: isPos ? barWidth : 0,
                    background: isPos
                      ? `linear-gradient(to right, ${color}, ${color}99)`
                      : "transparent",
                    borderRadius: "0 4px 4px 0",
                    transition: "width 0.7s cubic-bezier(0.4,0,0.2,1)",
                    transitionDelay: `${i * 30}ms`,
                    boxShadow:
                      isPos && isHovered ? `0 0 12px ${color}88` : "none",
                  }}
                />
              </div>

              <div
                style={{
                  width: 72,
                  paddingLeft: 12,
                  fontSize: 11,
                  color: isHovered ? color : "#475569",
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  transition: "color 0.2s",
                  flexShrink: 0,
                  fontFamily: "monospace",
                }}
              >
                {d.deviation >= 0 ? "+" : ""}
                {d.deviation}d
                {isHovered && (
                  <span
                    style={{
                      marginLeft: 4,
                      fontSize: 9,
                      color: "#94A3B8",
                      fontWeight: 400,
                    }}
                  >
                    ({d.avgDays}d)
                  </span>
                )}
              </div>
            </div>
          );
        })}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingLeft: 110,
            paddingRight: 72,
            marginTop: 16,
            color: "#94A3B8",
            fontSize: 10,
            letterSpacing: 1,
            fontFamily: "monospace",
          }}
        >
          <span style={{ marginRight: "auto" }}>← FASTER</span>
          <span style={{ color: "#CBD5E1" }}>|</span>
          <span style={{ marginLeft: "auto" }}>SLOWER →</span>
        </div>
      </div>

      <p
        style={{
          color: "#9CA3AF",
          fontSize: 11,
          marginTop: 28,
          letterSpacing: 1,
          textAlign: "center",
          fontFamily: "monospace",
        }}
      >
        * SAMPLE DATA FOR VISUALIZATION PURPOSES · DERIVED: INSTALLATION DATE −
        APPLICATION DATE
      </p>
    </div>
  );
}

