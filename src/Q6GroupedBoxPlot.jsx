import { useState, useMemo } from "react";

const STATUS_COLORS = {
  Active: "#3B82F6",
  Processing: "#F97316",
  Applied: "#22C55E",
  Terminated: "#EF4444",
  "On-Hold": "#9CA3AF",
};

const statuses = ["Active", "Processing", "Applied", "Terminated", "On-Hold"];
const regions = ["NCR", "Region III", "Region IV-A", "Region VII"];

// Generate sample tenure data (in months) for each Status × Region combination
const generateTenureData = () => {
  const data = {};
  const seedProfiles = {
    NCR: {
      Active: { base: 18, spread: 10, outliers: [42, 45] },
      Processing: { base: 3, spread: 3, outliers: [12] },
      Applied: { base: 1, spread: 1.5, outliers: [6] },
      Terminated: { base: 10, spread: 6, outliers: [30] },
      "On-Hold": { base: 5, spread: 4, outliers: [18] },
    },
    "Region III": {
      Active: { base: 15, spread: 8, outliers: [38] },
      Processing: { base: 4, spread: 3, outliers: [14] },
      Applied: { base: 1.5, spread: 2, outliers: [8] },
      Terminated: { base: 8, spread: 5, outliers: [25] },
      "On-Hold": { base: 6, spread: 5, outliers: [20] },
    },
    "Region IV-A": {
      Active: { base: 20, spread: 12, outliers: [48, 50] },
      Processing: { base: 2.5, spread: 2, outliers: [10] },
      Applied: { base: 0.8, spread: 1, outliers: [5] },
      Terminated: { base: 12, spread: 7, outliers: [34] },
      "On-Hold": { base: 4, spread: 3, outliers: [15] },
    },
    "Region VII": {
      Active: { base: 14, spread: 7, outliers: [35] },
      Processing: { base: 5, spread: 4, outliers: [16] },
      Applied: { base: 2, spread: 2, outliers: [9] },
      Terminated: { base: 7, spread: 4, outliers: [22] },
      "On-Hold": { base: 7, spread: 5, outliers: [22] },
    },
  };

  // Simple seeded pseudo-random
  let seed = 42;
  const rand = () => {
    seed = (seed * 16807 + 0) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  regions.forEach((region) => {
    data[region] = {};
    statuses.forEach((status) => {
      const profile = seedProfiles[region][status];
      const values = [];
      // Generate 30 data points per group
      for (let i = 0; i < 30; i++) {
        // Box-Muller for normal-ish distribution
        const u1 = rand();
        const u2 = rand();
        const z =
          Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        const val = Math.max(0.1, profile.base + z * profile.spread * 0.4);
        values.push(parseFloat(val.toFixed(1)));
      }
      // Add outliers
      profile.outliers.forEach((o) => values.push(o));
      values.sort((a, b) => a - b);
      data[region][status] = values;
    });
  });

  return data;
};

const computeBoxStats = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  const q1Idx = Math.floor(n * 0.25);
  const q3Idx = Math.floor(n * 0.75);
  const median =
    n % 2 === 0
      ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
      : sorted[Math.floor(n / 2)];
  const q1 = sorted[q1Idx];
  const q3 = sorted[q3Idx];
  const iqr = q3 - q1;
  const whiskerLow = Math.max(sorted[0], q1 - 1.5 * iqr);
  const whiskerHigh = Math.min(sorted[n - 1], q3 + 1.5 * iqr);

  // Find actual whisker values (nearest data points within range)
  const actualWhiskerLow = sorted.find((v) => v >= whiskerLow) || whiskerLow;
  const actualWhiskerHigh =
    [...sorted].reverse().find((v) => v <= whiskerHigh) || whiskerHigh;

  const outliers = sorted.filter(
    (v) => v < actualWhiskerLow || v > actualWhiskerHigh
  );

  return {
    q1,
    q3,
    median,
    whiskerLow: actualWhiskerLow,
    whiskerHigh: actualWhiskerHigh,
    iqr,
    outliers,
  };
};

const tenureData = generateTenureData();

// SVG Box Plot
const BOX_WIDTH = 28;
const CHART_PADDING = { top: 40, right: 40, bottom: 80, left: 70 };
const CHART_WIDTH = 960;
const CHART_HEIGHT = 500;
const PLOT_WIDTH = CHART_WIDTH - CHART_PADDING.left - CHART_PADDING.right;
const PLOT_HEIGHT = CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom;

export default function Q6GroupedBoxPlot() {
  const [hoveredStatus, setHoveredStatus] = useState(null);
  const [tooltip, setTooltip] = useState(null);

  const maxVal = useMemo(() => {
    let max = 0;
    regions.forEach((r) => {
      statuses.forEach((s) => {
        const stats = computeBoxStats(tenureData[r][s]);
        const localMax = stats.whiskerHigh;
        if (localMax > max) max = localMax;
      });
    });
    return Math.ceil(max / 5) * 5 + 5;
  }, []);

  const yScale = (val) => {
    const effectiveMax = maxVal * 0.7;
    const ratio = Math.min(val / effectiveMax, 1);
    const raw =
      CHART_PADDING.top + PLOT_HEIGHT - ratio * PLOT_HEIGHT;
    const topLimit = CHART_PADDING.top + 5;
    const bottomLimit = CHART_PADDING.top + PLOT_HEIGHT - 5;
    return Math.max(topLimit, Math.min(bottomLimit, raw));
  };

  const yTicks = [];
  for (let i = 0; i <= maxVal; i += 5) {
    yTicks.push(i);
  }

  // Calculate x positions
  const regionGap = 40;
  const statusGap = 6;
  const groupWidth =
    statuses.length * BOX_WIDTH + (statuses.length - 1) * statusGap;
  const totalWidth =
    regions.length * groupWidth + (regions.length - 1) * regionGap;
  const startX =
    CHART_PADDING.left + (PLOT_WIDTH - totalWidth) / 2;

  const getBoxX = (regionIdx, statusIdx) => {
    return (
      startX +
      regionIdx * (groupWidth + regionGap) +
      statusIdx * (BOX_WIDTH + statusGap)
    );
  };

  const handleBoxHover = (region, status, stats, x, y) => {
    setTooltip({ region, status, stats, x, y });
  };

  return (
    <div
      style={{
        background:
          "radial-gradient(circle at top, #ffffff 0%, #F3F4F6 45%, #E5E7EB 100%)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(28px, 7vh, 40px) clamp(16px, 5vw, 24px)",
        fontFamily:
          "'Poppins', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{ textAlign: "center", marginBottom: 8, maxWidth: 900 }}
      >
        <p
          style={{
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#9CA3AF",
            marginBottom: 8,
            fontWeight: 600,
          }}
        >
          Case Study 3 · Question 6 · Visualization Sketch
        </p>
        <h1
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: "#111827",
            margin: "0 0 6px 0",
            lineHeight: 1.3,
          }}
        >
          What Is the Tenure of Accounts in
          <br />
          Different Status in Different Regions?
        </h1>
        <p
          style={{
            fontSize: 14,
            color: "#6B7280",
            margin: "8px 0 0 0",
          }}
        >
          Grouped Box Plot (Side-by-Side) — Sample / Placeholder Data
        </p>
      </div>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          gap: 20,
          marginBottom: 20,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {statuses.map((status) => (
          <div
            key={status}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              opacity:
                hoveredStatus && hoveredStatus !== status ? 0.3 : 1,
              transition: "opacity 0.2s ease",
            }}
            onMouseEnter={() => setHoveredStatus(status)}
            onMouseLeave={() => setHoveredStatus(null)}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 4,
                background: STATUS_COLORS[status],
              }}
            />
            <span
              style={{
                fontSize: 13,
                color: "#374151",
                fontWeight: 500,
              }}
            >
              {status}
            </span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div
        style={{
          width: "100%",
          maxWidth: CHART_WIDTH + 40,
          background: "#FFFFFF",
          borderRadius: 16,
          border: "1px solid #E5E7EB",
          padding: "20px clamp(12px, 3vw, 16px) 12px clamp(12px, 3vw, 16px)",
          position: "relative",
          boxShadow: "0 18px 45px rgba(15,23,42,0.08)",
        }}
      >
        <svg
          width="100%"
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          style={{ overflow: "visible" }}
        >
          {/* Grid lines */}
          {yTicks.map((tick) => (
            <g key={tick}>
              <line
                x1={CHART_PADDING.left}
                x2={CHART_WIDTH - CHART_PADDING.right}
                y1={yScale(tick)}
                y2={yScale(tick)}
                stroke="#E5E7EB"
                strokeDasharray="3 3"
              />
              <text
                x={CHART_PADDING.left - 12}
                y={yScale(tick)}
                textAnchor="end"
                dominantBaseline="middle"
                fill="#6B7280"
                fontSize={11}
              >
                {tick}
              </text>
            </g>
          ))}

          {/* Y-axis label */}
          <text
            x={18}
            y={CHART_PADDING.top + PLOT_HEIGHT / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#6B7280"
            fontSize={13}
            fontWeight={600}
            transform={`rotate(-90, 18, ${
              CHART_PADDING.top + PLOT_HEIGHT / 2
            })`}
          >
            Tenure (Months)
          </text>

          {/* X-axis base line */}
          <line
            x1={CHART_PADDING.left}
            x2={CHART_WIDTH - CHART_PADDING.right}
            y1={yScale(0)}
            y2={yScale(0)}
            stroke="#D1D5DB"
          />

          {/* Box plots */}
          {regions.map((region, rIdx) =>
            statuses.map((status, sIdx) => {
              const stats = computeBoxStats(tenureData[region][status]);
              const x = getBoxX(rIdx, sIdx);
              const centerX = x + BOX_WIDTH / 2;
              const color = STATUS_COLORS[status];
              const isHidden =
                hoveredStatus && hoveredStatus !== status;
              const opacity = isHidden ? 0.12 : 1;

              return (
                <g
                  key={`${region}-${status}`}
                  style={{
                    transition: "opacity 0.2s ease",
                    opacity,
                  }}
                  onMouseEnter={(e) => {
                    handleBoxHover(
                      region,
                      status,
                      stats,
                      centerX,
                      yScale(stats.q3)
                    );
                  }}
                  onMouseLeave={() => setTooltip(null)}
                  cursor="pointer"
                >
                  {/* Whisker line (vertical) */}
                  <line
                    x1={centerX}
                    x2={centerX}
                    y1={yScale(stats.whiskerHigh)}
                    y2={yScale(stats.whiskerLow)}
                    stroke={color}
                    strokeWidth={1.5}
                    strokeOpacity={0.6}
                  />

                  {/* Whisker top cap */}
                  <line
                    x1={x + 6}
                    x2={x + BOX_WIDTH - 6}
                    y1={yScale(stats.whiskerHigh)}
                    y2={yScale(stats.whiskerHigh)}
                    stroke={color}
                    strokeWidth={1.5}
                    strokeOpacity={0.8}
                  />

                  {/* Whisker bottom cap */}
                  <line
                    x1={x + 6}
                    x2={x + BOX_WIDTH - 6}
                    y1={yScale(stats.whiskerLow)}
                    y2={yScale(stats.whiskerLow)}
                    stroke={color}
                    strokeWidth={1.5}
                    strokeOpacity={0.8}
                  />

                  {/* Box (IQR) */}
                  <rect
                    x={x}
                    y={yScale(stats.q3)}
                    width={BOX_WIDTH}
                    height={yScale(stats.q1) - yScale(stats.q3)}
                    fill={color}
                    fillOpacity={0.25}
                    stroke={color}
                    strokeWidth={1.5}
                    rx={3}
                    ry={3}
                  />

                  {/* Median line */}
                  <line
                    x1={x + 2}
                    x2={x + BOX_WIDTH - 2}
                    y1={yScale(stats.median)}
                    y2={yScale(stats.median)}
                    stroke={color}
                    strokeWidth={2.5}
                    strokeLinecap="round"
                  />

                  {/* Outlier points */}
                  {stats.outliers.map((outlier, oIdx) => (
                    <circle
                      key={oIdx}
                      cx={centerX}
                      cy={yScale(outlier)}
                      r={3.5}
                      fill="none"
                      stroke={color}
                      strokeWidth={1.5}
                      opacity={0.8}
                    />
                  ))}
                </g>
              );
            })
          )}

          {/* Region brackets and labels */}
          {regions.map((region, rIdx) => {
            const groupStartX = getBoxX(rIdx, 0);
            const groupEndX =
              getBoxX(rIdx, statuses.length - 1) + BOX_WIDTH;
            const groupCenterX = (groupStartX + groupEndX) / 2;
            const bracketY = yScale(0) + 14;

            return (
              <g key={`label-${region}`}>
                {/* Status labels under each box */}
                {statuses.map((status, sIdx) => {
                  const bx =
                    getBoxX(rIdx, sIdx) + BOX_WIDTH / 2;
                  return (
                    <text
                      key={`${region}-${status}-label`}
                      x={bx}
                      y={yScale(0) + 14}
                      textAnchor="middle"
                      fill="#9CA3AF"
                      fontSize={8}
                    >
                      {status.substring(0, 3).toUpperCase()}
                    </text>
                  );
                })}

                {/* Bracket */}
                <line
                  x1={groupStartX}
                  x2={groupEndX}
                  y1={bracketY + 14}
                  y2={bracketY + 14}
                  stroke="#D1D5DB"
                  strokeWidth={1.5}
                />
                <line
                  x1={groupStartX}
                  x2={groupStartX}
                  y1={bracketY + 9}
                  y2={bracketY + 14}
                  stroke="#D1D5DB"
                  strokeWidth={1.5}
                />
                <line
                  x1={groupEndX}
                  x2={groupEndX}
                  y1={bracketY + 9}
                  y2={bracketY + 14}
                  stroke="#D1D5DB"
                  strokeWidth={1.5}
                />

                {/* Region name */}
                <text
                  x={groupCenterX}
                  y={bracketY + 30}
                  textAnchor="middle"
                  fill="#4B5563"
                  fontSize={12}
                  fontWeight={700}
                  letterSpacing="0.05em"
                >
                  {region.toUpperCase()}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {tooltip && (
          <div
            style={{
              position: "absolute",
              left: `${(tooltip.x / CHART_WIDTH) * 100}%`,
              top: `${(tooltip.y / CHART_HEIGHT) * 100 - 4}%`,
              transform: "translate(-50%, -100%)",
              background: "#FFFFFF",
              border: "1px solid rgba(15,23,42,0.08)",
              borderRadius: 10,
              padding: "12px 16px",
              pointerEvents: "none",
              boxShadow: "0 8px 32px rgba(15,23,42,0.15)",
              zIndex: 10,
              whiteSpace: "nowrap",
              fontFamily: "'Georgia', serif",
            }}
          >
            <p
              style={{
                color: "#111827",
                fontWeight: 700,
                fontSize: 13,
                margin: "0 0 2px 0",
              }}
            >
              <span
                style={{
                  color: STATUS_COLORS[tooltip.status],
                }}
              >
                {tooltip.status}
              </span>
              {" · "}
              {tooltip.region}
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "auto auto",
                gap: "2px 14px",
                marginTop: 8,
              }}
            >
              {[
                ["Median", `${tooltip.stats.median.toFixed(1)} mo`],
                [
                  "IQR",
                  `${tooltip.stats.q1.toFixed(1)} – ${tooltip.stats.q3.toFixed(
                    1
                  )} mo`,
                ],
                [
                  "Whiskers",
                  `${tooltip.stats.whiskerLow.toFixed(
                    1
                  )} – ${tooltip.stats.whiskerHigh.toFixed(1)} mo`,
                ],
                [
                  "Outliers",
                  tooltip.stats.outliers.length > 0
                    ? `${
                        tooltip.stats.outliers
                          .map((o) => `${o}`)
                          .join(", ")
                      } mo`
                    : "None",
                ],
              ].map(([label, val]) => (
                <>
                  <span
                    key={`${label}-label`}
                    style={{
                      color: "#6B7280",
                      fontSize: 12,
                    }}
                  >
                    {label}
                  </span>
                  <span
                    key={`${label}-value`}
                    style={{
                      color: "#111827",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {val}
                  </span>
                </>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Design Elements Summary */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          maxWidth: CHART_WIDTH + 40,
          width: "100%",
          marginTop: 20,
        }}
      >
        {[
          {
            label: "Position",
            desc: "Boxes grouped by Region with each Status placed side by side; clear spacing separates region groups",
          },
          {
            label: "Color",
            desc: "Distinct fill per Status — Blue (Active), Orange (Processing), Green (Applied), Red (Terminated), Gray (On-Hold)",
          },
          {
            label: "Box",
            desc: "Top/bottom edges = Q3/Q1 (IQR); median line inside marks the 50th percentile",
          },
          {
            label: "Whiskers",
            desc: "Extend to min/max within 1.5× IQR; outliers shown as individual hollow circles beyond whiskers",
          },
        ].map((el) => (
          <div
            key={el.label}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              padding: "12px 16px",
              background: "#F9FAFB",
              borderRadius: 10,
              border: "1px solid #E5E7EB",
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#3B82F6",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                minWidth: 64,
                fontFamily: "monospace",
              }}
            >
              {el.label}
            </span>
            <span
              style={{
                fontSize: 13,
                color: "#4B5563",
                lineHeight: 1.5,
              }}
            >
              {el.desc}
            </span>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <p
        style={{
          fontSize: 11,
          color: "#9CA3AF",
          marginTop: 16,
          textAlign: "center",
        }}
      >
        * Values shown are sample/placeholder data for visualization purposes
        only
      </p>
    </div>
  );
}

