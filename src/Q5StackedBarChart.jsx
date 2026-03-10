import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";

const STATUS_COLORS = {
  Active: "#3B82F6",
  Processing: "#F97316",
  Applied: "#22C55E",
  Terminated: "#EF4444",
  "On-Hold": "#9CA3AF",
};

// Sample data: agents per region with account status counts
const rawData = {
  NCR: {
    "Agent Santos": {
      Active: 120,
      Processing: 35,
      Applied: 20,
      Terminated: 15,
      "On-Hold": 10,
    },
    "Agent Reyes": {
      Active: 95,
      Processing: 40,
      Applied: 25,
      Terminated: 20,
      "On-Hold": 15,
    },
    "Agent Cruz": {
      Active: 110,
      Processing: 30,
      Applied: 15,
      Terminated: 10,
      "On-Hold": 8,
    },
  },
  "Region III": {
    "Agent Dela Cruz": {
      Active: 80,
      Processing: 25,
      Applied: 18,
      Terminated: 12,
      "On-Hold": 10,
    },
    "Agent Garcia": {
      Active: 70,
      Processing: 30,
      Applied: 22,
      Terminated: 18,
      "On-Hold": 12,
    },
    "Agent Ramos": {
      Active: 90,
      Processing: 20,
      Applied: 10,
      Terminated: 8,
      "On-Hold": 5,
    },
  },
  "Region IV-A": {
    "Agent Mendoza": {
      Active: 100,
      Processing: 28,
      Applied: 22,
      Terminated: 14,
      "On-Hold": 9,
    },
    "Agent Villanueva": {
      Active: 75,
      Processing: 35,
      Applied: 20,
      Terminated: 22,
      "On-Hold": 18,
    },
    "Agent Torres": {
      Active: 85,
      Processing: 22,
      Applied: 15,
      Terminated: 10,
      "On-Hold": 7,
    },
  },
  "Region VII": {
    "Agent Bautista": {
      Active: 65,
      Processing: 20,
      Applied: 15,
      Terminated: 10,
      "On-Hold": 8,
    },
    "Agent Aquino": {
      Active: 55,
      Processing: 25,
      Applied: 18,
      Terminated: 15,
      "On-Hold": 12,
    },
    "Agent Lim": {
      Active: 78,
      Processing: 18,
      Applied: 12,
      Terminated: 8,
      "On-Hold": 6,
    },
  },
};

const statuses = ["Active", "Processing", "Applied", "Terminated", "On-Hold"];

// Transform data for grouped display
const buildChartData = () => {
  const data = [];
  const regions = Object.keys(rawData);

  regions.forEach((region, rIdx) => {
    const agents = Object.keys(rawData[region]);
    agents.forEach((agent) => {
      const entry = {
        name: agent.replace("Agent ", ""),
        region,
        ...rawData[region][agent],
        _total: Object.values(rawData[region][agent]).reduce(
          (a, b) => a + b,
          0
        ),
      };
      data.push(entry);
    });
    if (rIdx < regions.length - 1) {
      data.push({
        name: "",
        region: "__spacer__",
        Active: 0,
        Processing: 0,
        Applied: 0,
        Terminated: 0,
        "On-Hold": 0,
        _total: 0,
      });
    }
  });

  return data;
};

const chartData = buildChartData();

// Track the center agent index per region so we label each region once, centered
const regionIndices = chartData.reduce((acc, entry, index) => {
  if (entry.region && entry.region !== "__spacer__") {
    if (!acc[entry.region]) acc[entry.region] = [];
    acc[entry.region].push(index);
  }
  return acc;
}, {});

const regionCenterIndexByRegion = Object.keys(regionIndices).reduce(
  (acc, region) => {
    const indices = regionIndices[region];
    const first = indices[0];
    const last = indices[indices.length - 1];
    acc[region] = Math.round((first + last) / 2);
    return acc;
  },
  {}
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length && label) {
    const entry = payload[0]?.payload;
    if (entry?.region === "__spacer__") return null;
    const total = entry?._total || 0;
    return (
      <div
        style={{
          background: "#ffffff",
          border: "1px solid rgba(15,23,42,0.08)",
          borderRadius: "10px",
          padding: "14px 18px",
          fontFamily: "'Georgia', serif",
          boxShadow: "0 10px 30px rgba(15,23,42,0.15)",
        }}
      >
        <p
          style={{
            color: "#111827",
            fontWeight: 700,
            fontSize: 14,
            margin: "0 0 4px 0",
          }}
        >
          Agent {label}
        </p>
        <p
          style={{
            color: "#6B7280",
            fontSize: 12,
            margin: "0 0 10px 0",
          }}
        >
          {entry?.region} — {total} total accounts
        </p>
        {payload
          .slice()
          .reverse()
          .map((p, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 20,
                padding: "3px 0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 3,
                    background: p.fill,
                  }}
                />
            <span style={{ color: "#374151", fontSize: 13 }}>
                  {p.dataKey}
                </span>
              </div>
              <span
                style={{
                  color: "#111827",
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                {p.value} ({total ? ((p.value / total) * 100).toFixed(1) : 0}%)
              </span>
            </div>
          ))}
      </div>
    );
  }
  return null;
};

// Custom X-axis tick that shows Agent (top) + Region (bottom)
const CustomAgentRegionTick = ({ x, y, payload }) => {
  const agentName = payload.value;
  const entry = chartData[payload.index];
  const region = entry?.region === "__spacer__" ? "" : entry?.region;

  // Skip spacer ticks entirely
  if (!entry || entry.region === "__spacer__") {
    return null;
  }

  const showRegion =
    region && regionCenterIndexByRegion[region] === payload.index;

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={10}
        textAnchor="middle"
        fill="#4B5563"
        fontSize={12}
        fontFamily="'Georgia', serif"
      >
        {agentName}
      </text>
      {showRegion ? (
        <text
          x={0}
          y={0}
          dy={26}
          textAnchor="middle"
          fill="#374151"
          fontSize={12}
          fontWeight={700}
          fontFamily="'Georgia', serif"
        >
          {region.toUpperCase()}
        </text>
      ) : null}
    </g>
  );
};

export default function Q5StackedBarChart() {
  const [hoveredStatus, setHoveredStatus] = useState(null);

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
        padding: "40px 24px",
        fontFamily: "'Georgia', serif",
      }}
    >

      <div style={{ textAlign: "center", marginBottom: 8, maxWidth: 900 }}>
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
          Case Study 3 · Question 5 · Visualization Sketch
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
          What Are the Status of Accounts
          <br />
          Per Agent Per Region?
        </h1>
        <p
          style={{
            fontSize: 14,
            color: "#6B7280",
            margin: "8px 0 0 0",
          }}
        >
          Grouped Stacked Bar Chart — Sample / Placeholder Data
        </p>
      </div>

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
              opacity: hoveredStatus && hoveredStatus !== status ? 0.3 : 1,
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

      <div
        style={{
          width: "100%",
          maxWidth: 960,
          background: "#FFFFFF",
          borderRadius: 16,
          border: "1px solid #E5E7EB",
          padding: "24px 16px 8px 16px",
          boxShadow: "0 18px 45px rgba(15,23,42,0.08)",
        }}
      >
        <ResponsiveContainer width="100%" height={440}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
            barCategoryGap="15%"
            barGap={2}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E5E7EB"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              tick={<CustomAgentRegionTick />}
              axisLine={{ stroke: "#D1D5DB" }}
              tickLine={false}
              interval={0}
            />
            <YAxis
              tick={{ fill: "#6B7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            >
              <Label
                value="Count of Accounts"
                angle={-90}
                position="insideLeft"
                offset={-5}
                style={{
                  fill: "#6B7280",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              />
            </YAxis>
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(15,23,42,0.04)" }}
            />
            {statuses.map((status) => (
              <Bar
                key={status}
                dataKey={status}
                stackId="a"
                fill={STATUS_COLORS[status]}
                opacity={hoveredStatus && hoveredStatus !== status ? 0.2 : 1}
                radius={status === "On-Hold" ? [4, 4, 0, 0] : [0, 0, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>

      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          maxWidth: 960,
          width: "100%",
          marginTop: 20,
        }}
      >
        {[
          {
            label: "Position",
            desc: "Bars grouped by Region with agents clustered side by side for within-region comparison",
          },
          {
            label: "Size",
            desc: "Segment height encodes account count — total bar height = agent's total volume",
          },
          {
            label: "Shape",
            desc: "Standard rectangular bar segments with two-level x-axis labeling (Agent + Region)",
          },
          {
            label: "Color",
            desc: "5 distinct hues per Status — perceptually distinct and colorblind-friendly",
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

      <p
        style={{
          fontSize: 11,
          color: "#9CA3AF",
          marginTop: 16,
          textAlign: "center",
        }}
      >
        * Values shown are sample/placeholder data for visualization purposes only
      </p>
    </div>
  );
}

