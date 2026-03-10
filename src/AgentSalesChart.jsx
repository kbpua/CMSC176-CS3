import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    region: "NCR",
    "Agent Santos": 420000,
    "Agent Reyes": 310000,
    "Agent Cruz": 280000,
    "Agent Lim": 390000,
  },
  {
    region: "Region I",
    "Agent Santos": 190000,
    "Agent Reyes": 340000,
    "Agent Cruz": 410000,
    "Agent Lim": 220000,
  },
  {
    region: "Region II",
    "Agent Santos": 360000,
    "Agent Reyes": 150000,
    "Agent Cruz": 200000,
    "Agent Lim": 450000,
  },
  {
    region: "Region III",
    "Agent Santos": 280000,
    "Agent Reyes": 460000,
    "Agent Cruz": 310000,
    "Agent Lim": 175000,
  },
  {
    region: "Region IV",
    "Agent Santos": 500000,
    "Agent Reyes": 230000,
    "Agent Cruz": 380000,
    "Agent Lim": 260000,
  },
  {
    region: "Region V",
    "Agent Santos": 170000,
    "Agent Reyes": 395000,
    "Agent Cruz": 290000,
    "Agent Lim": 330000,
  },
];

const AGENTS = ["Agent Santos", "Agent Reyes", "Agent Cruz", "Agent Lim"];
const COLORS = ["#1a6b8a", "#e05c2a", "#2db37a", "#8a3fb5"];

const formatPeso = (value) => `₱${(value / 1000).toFixed(0)}K`;

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const sorted = [...payload].sort((a, b) => b.value - a.value);
    return (
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: "8px",
          padding: "12px 16px",
          boxShadow: "0 10px 24px rgba(15,23,42,0.12)",
          fontFamily: "monospace",
          fontSize: "12px",
          minWidth: "180px",
        }}
      >
        <p
          style={{
            color: "#64748B",
            marginBottom: 8,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontSize: 10,
          }}
        >
          {label}
        </p>
        {sorted.map((entry, i) => (
          <div
            key={entry.name}
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
              marginBottom: 4,
            }}
          >
            <span
              style={{
                color: entry.color,
                fontWeight: i === 0 ? "700" : "400",
              }}
            >
              {i === 0 ? "★ " : ""}
              {entry.name.replace("Agent ", "")}
            </span>
            <span style={{ color: i === 0 ? "#0F172A" : "#475569" }}>
              {formatPeso(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function SalesChart() {
  const [highlight, setHighlight] = useState(null);

  return (
    <div
      style={{
        background: "#F8F9FC",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        fontFamily: "'Georgia', serif",
      }}
    >
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Playfair+Display:wght@700&display=swap');`}
      </style>

      <div style={{ textAlign: "center", marginBottom: 40, maxWidth: 700 }}>
        <p
          style={{
            color: "#7C3AED",
            letterSpacing: 3,
            fontSize: 11,
            textTransform: "uppercase",
            marginBottom: 10,
            fontFamily: "monospace",
          }}
        >
          Descriptive Analytics · Sales Performance
        </p>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            color: "#1E293B",
            fontSize: "clamp(22px, 4vw, 36px)",
            fontWeight: 700,
            margin: "0 0 12px",
            lineHeight: 1.2,
          }}
        >
          Which Agents Made the Most Sales Per Region?
        </h1>
        <p
          style={{
            color: "#64748B",
            fontSize: 13,
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          Grouped bar chart comparing total Plan Revenue (₱) by Agent across
          Philippine geographic regions.
          <br />
          Hover over bars for details · ★ indicates top performer per region.
        </p>
      </div>

      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: 16,
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          padding: "32px 24px 24px",
          width: "100%",
          maxWidth: 900,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            marginBottom: 24,
          }}
        >
          <span
            style={{
              color: "#64748B",
              fontSize: 11,
              alignSelf: "center",
              marginRight: 4,
              fontFamily: "monospace",
              letterSpacing: 1,
            }}
          >
            FILTER:
          </span>
          {AGENTS.map((agent, i) => (
            <button
              key={agent}
              type="button"
              onClick={() => setHighlight(highlight === agent ? null : agent)}
              style={{
                background:
                  highlight === agent ? COLORS[i] : "#FFFFFF",
                border: `1px solid ${
                  highlight === agent ? COLORS[i] : "rgba(148,163,184,0.55)"
                }`,
                color: highlight === agent ? "#FFFFFF" : "#334155",
                borderRadius: 20,
                padding: "4px 14px",
                fontSize: 11,
                cursor: "pointer",
                letterSpacing: "0.05em",
                transition: "all 0.2s",
                fontFamily: "monospace",
              }}
            >
              {agent}
            </button>
          ))}
        </div>

        <ResponsiveContainer width="100%" height={380}>
          <BarChart data={data} barCategoryGap="25%" barGap={3}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E2E8F0"
              vertical={false}
            />
            <XAxis
              dataKey="region"
              tick={{
                fill: "#475569",
                fontSize: 11,
                fontFamily: "monospace",
              }}
              axisLine={{ stroke: "#CBD5E1" }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatPeso}
              tick={{
                fill: "#475569",
                fontSize: 10,
                fontFamily: "monospace",
              }}
              axisLine={false}
              tickLine={false}
              label={{
                value: "Plan Revenue (₱)",
                angle: -90,
                position: "insideLeft",
                offset: 10,
                style: {
                  fill: "#64748B",
                  fontSize: 10,
                  fontFamily: "monospace",
                  letterSpacing: 1,
                },
              }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "#F1F5F9" }}
            />
            <Legend
              wrapperStyle={{
                paddingTop: 20,
                fontFamily: "monospace",
                fontSize: 11,
                color: "#475569",
              }}
              formatter={(value) => (
                <span style={{ color: "#475569" }}>{value}</span>
              )}
            />
            {AGENTS.map((agent, i) => (
              <Bar
                key={agent}
                dataKey={agent}
                fill={COLORS[i]}
                radius={[4, 4, 0, 0]}
                opacity={
                  highlight === null || highlight === agent ? 1 : 0.15
                }
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: 900,
          marginTop: 12,
          padding: "0 8px",
        }}
      >
        <p
          style={{
            color: "#94A3B8",
            fontSize: 10,
            letterSpacing: "0.1em",
            fontFamily: "monospace",
          }}
        >
          ← X-AXIS: REGION (Categorical)
        </p>
        <p
          style={{
            color: "#94A3B8",
            fontSize: 10,
            letterSpacing: "0.1em",
            fontFamily: "monospace",
          }}
        >
          COLOR: AGENT (Categorical) →
        </p>
      </div>

      <p
        style={{
          color: "#9CA3AF",
          fontSize: 10,
          marginTop: 20,
          letterSpacing: "0.08em",
          fontFamily: "monospace",
        }}
      >
        * Sample data for visualization purposes · Variables: Agent
        (Categorical), Region (Categorical), Plan Revenue (Continuous)
      </p>
    </div>
  );
}

