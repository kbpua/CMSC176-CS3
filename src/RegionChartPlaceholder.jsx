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
  Cell,
} from "recharts";

const data = [
  { region: "NCR", users: 1240 },
  { region: "CAR", users: 430 },
  { region: "Region I", users: 610 },
  { region: "Region II", users: 380 },
  { region: "Region III", users: 890 },
  { region: "Region IV-A", users: 1050 },
  { region: "Region IV-B", users: 340 },
  { region: "Region V", users: 520 },
  { region: "Region VI", users: 670 },
  { region: "Region VII", users: 780 },
  { region: "Region VIII", users: 290 },
  { region: "Region IX", users: 410 },
  { region: "Region X", users: 560 },
  { region: "Region XI", users: 720 },
  { region: "Region XII", users: 480 },
  { region: "BARMM", users: 210 },
  { region: "Caraga", users: 330 },
].sort((a, b) => b.users - a.users);

const MAX_VALUE = data[0].users;
const BASE_COLOR = "#0E7490";
const HIGHLIGHT_COLOR = "#0EA5E9";
const TOP_COLOR = "#0C4A6E";

export default function RegionChartPlaceholder() {
  const [hoveredRegion, setHoveredRegion] = useState(null);

  return (
    <div
      style={{
        background: "#F0F9FF",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily:
          "'Poppins', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        padding: "clamp(24px, 6vh, 40px) clamp(16px, 5vw, 24px)",
      }}
    >
      {/* Title Block */}
      <div style={{ textAlign: "center", marginBottom: 32, maxWidth: 650 }}>
        <div
          style={{
            fontSize: 11,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#9CA3AF",
            marginBottom: 8,
            fontFamily: "monospace",
          }}
        >
          Case Study 3 · Question 2 · Visualization Sketch
        </div>
        <h1
          style={{
            fontSize: 22,
            fontWeight: "bold",
            color: "#0C4A6E",
            lineHeight: 1.3,
            margin: 0,
          }}
        >
          Which Region Has the Most Number of
          <br />
          Existing Broadband Users?
        </h1>
        <p style={{ color: "#64748B", fontSize: 13, marginTop: 10 }}>
          Horizontal Bar Chart — Sample / Placeholder Data
        </p>
      </div>

      {/* Chart Card */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 16,
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          padding: "24px clamp(16px, 4vw, 24px) 20px",
          width: "100%",
          maxWidth: 780,
        }}
      >
        <ResponsiveContainer width="100%" height={520}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 10, right: 40, left: 10, bottom: 40 }}
            barCategoryGap="20%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E2E8F0"
              horizontal={false}
            />
            <XAxis
              type="number"
              tick={{ fill: "#475569", fontSize: 12 }}
              axisLine={{ stroke: "#CBD5E1" }}
              tickLine={false}
            >
              <Label
                value="Number of Active Broadband Users"
                offset={-10}
                position="insideBottom"
                style={{
                  fill: "#64748B",
                  fontSize: 12,
                  fontFamily: "monospace",
                  letterSpacing: 1,
                }}
              />
            </XAxis>
            <YAxis
              type="category"
              dataKey="region"
              tick={{
                fill: "#475569",
                fontSize: 12,
                fontFamily:
                  "'Poppins', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              }}
              axisLine={false}
              tickLine={false}
              width={90}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: "none",
                boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                fontFamily:
                  "'Poppins', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                fontSize: 13,
              }}
              cursor={{ fill: "#F0F9FF" }}
              formatter={(value) => [value, "Active Users"]}
            />
            <Bar
              dataKey="users"
              radius={[0, 4, 4, 0]}
              onMouseEnter={(_, index) => setHoveredRegion(index)}
              onMouseLeave={() => setHoveredRegion(null)}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.users === MAX_VALUE
                      ? TOP_COLOR
                      : hoveredRegion === index
                      ? HIGHLIGHT_COLOR
                      : BASE_COLOR
                  }
                  opacity={
                    hoveredRegion !== null &&
                    hoveredRegion !== index &&
                    entry.users !== MAX_VALUE
                      ? 0.4
                      : 1
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Top Region Callout */}
        <div
          style={{
            background: "#F0F9FF",
            border: "1px solid #BAE6FD",
            borderRadius: 10,
            padding: "12px 16px",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 3,
              background: TOP_COLOR,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 12,
              color: "#0C4A6E",
              fontFamily: "monospace",
            }}
          >
            Darkest bar = Region with the most existing broadband users
          </span>
        </div>

        {/* Design Elements Annotation */}
        <div
          style={{
            borderTop: "1px solid #E2E8F0",
            paddingTop: 20,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          {[
            {
              label: "Position",
              desc: "Bars laid out horizontally — each region occupies its own row for clean readability",
            },
            {
              label: "Size",
              desc: "Bar length encodes active user count — longer = more users",
            },
            {
              label: "Shape",
              desc: "Rectangular horizontal bars with rounded right edges",
            },
            {
              label: "Color",
              desc: "Single teal color for all bars; darkest shade highlights the top region",
            },
          ].map(({ label, desc }) => (
            <div
              key={label}
              style={{ display: "flex", gap: 10, alignItems: "flex-start" }}
            >
              <span
                style={{
                  background: "#0C4A6E",
                  color: "#fff",
                  borderRadius: 4,
                  padding: "2px 8px",
                  fontSize: 10,
                  fontFamily: "monospace",
                  letterSpacing: 1,
                  whiteSpace: "nowrap",
                  marginTop: 2,
                }}
              >
                {label}
              </span>
              <span
                style={{
                  fontSize: 12,
                  color: "#64748B",
                  lineHeight: 1.5,
                }}
              >
                {desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      <p
        style={{
          marginTop: 16,
          fontSize: 11,
          color: "#9CA3AF",
          fontFamily: "monospace",
        }}
      >
        * Values shown are sample/placeholder data for visualization purposes only
      </p>
    </div>
  );
}

