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
  Label,
} from "recharts";

const data = [
  { ageGroup: "18–25", Male: 420, Female: 380 },
  { ageGroup: "26–34", Male: 610, Female: 570 },
  { ageGroup: "35–44", Male: 490, Female: 430 },
  { ageGroup: "45–54", Male: 310, Female: 260 },
];

const MALE_COLOR = "#2563EB";
const FEMALE_COLOR = "#E85D75";

export default function GroupedBarChart() {
  const [highlighted, setHighlighted] = useState(null);

  return (
    <div
      style={{
        background: "#F8F9FC",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Georgia', serif",
        padding: "32px 16px",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 32, maxWidth: 600 }}>
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
          Case Study 3 · Question 1 · Visualization Sketch
        </div>
        <h1
          style={{
            fontSize: 22,
            fontWeight: "bold",
            color: "#1E293B",
            lineHeight: 1.3,
            margin: 0,
          }}
        >
          Which Customer Age Group &amp; Sex Are More Likely
          <br />
          to Avail Broadband Services?
        </h1>
        <p style={{ color: "#64748B", fontSize: 13, marginTop: 10 }}>
          Grouped Bar Chart — Sample / Placeholder Data
        </p>
      </div>

      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 16,
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          padding: "32px 24px 24px",
          width: "100%",
          maxWidth: 700,
        }}
      >
        <ResponsiveContainer width="100%" height={380}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            barCategoryGap="30%"
            barGap={4}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E2E8F0"
              vertical={false}
            />
            <XAxis
              dataKey="ageGroup"
              tick={{
                fill: "#475569",
                fontSize: 13,
                fontFamily: "Georgia, serif",
              }}
              axisLine={{ stroke: "#CBD5E1" }}
              tickLine={false}
            >
              <Label
                value="Age Group"
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
              tick={{ fill: "#475569", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            >
              <Label
                value="Number of Customers"
                angle={-90}
                position="insideLeft"
                offset={-5}
                style={{
                  fill: "#64748B",
                  fontSize: 12,
                  fontFamily: "monospace",
                  letterSpacing: 1,
                }}
              />
            </YAxis>
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: "none",
                boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                fontFamily: "Georgia, serif",
                fontSize: 13,
              }}
              cursor={{ fill: "#F1F5F9" }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="square"
              wrapperStyle={{
                fontSize: 13,
                fontFamily: "Georgia, serif",
                paddingBottom: 12,
              }}
            />
            <Bar
              dataKey="Male"
              fill={MALE_COLOR}
              radius={[4, 4, 0, 0]}
              onMouseEnter={() => setHighlighted("Male")}
              onMouseLeave={() => setHighlighted(null)}
              opacity={highlighted && highlighted !== "Male" ? 0.35 : 1}
            />
            <Bar
              dataKey="Female"
              fill={FEMALE_COLOR}
              radius={[4, 4, 0, 0]}
              onMouseEnter={() => setHighlighted("Female")}
              onMouseLeave={() => setHighlighted(null)}
              opacity={highlighted && highlighted !== "Female" ? 0.35 : 1}
            />
          </BarChart>
        </ResponsiveContainer>

        <div
          style={{
            marginTop: 24,
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
              desc: "Bars grouped side-by-side per age group for direct comparison",
            },
            {
              label: "Size",
              desc: "Bar height encodes count — taller = more customers",
            },
            {
              label: "Shape",
              desc: "Rectangular bars with rounded tops for readability",
            },
            {
              label: "Color",
              desc: "Blue = Male · Red = Female, distinct and accessible",
            },
          ].map(({ label, desc }) => (
            <div
              key={label}
              style={{ display: "flex", gap: 10, alignItems: "flex-start" }}
            >
              <span
                style={{
                  background: "#1E293B",
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
        * Values shown are sample/placeholder data for visualization purposes
        only
      </p>
    </div>
  );
}

