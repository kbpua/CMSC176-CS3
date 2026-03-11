import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LabelList, Cell
} from "recharts";

const AGENTS = ["Santos", "Reyes", "Cruz", "Lim", "Garcia"];
const AGENT_COLORS = ["#2563eb", "#dc2626", "#16a34a", "#d97706", "#7c3aed"];

const REGIONS = [
  "NCR", "CAR", "Region I", "Region II", "Region III",
  "Region IV-A", "Region IV-B", "Region V", "Region VI",
  "Region VII", "Region VIII", "Region IX", "Region X",
  "Region XI", "Region XII", "Region XIII", "BARMM", "NIR"
];

// Deterministic sample data — count of Active + Terminated accounts per agent per region
const seed = (agent, region, offset = 0) => {
  const a = agent.length + agent.charCodeAt(0) + offset;
  const r = region.length + region.charCodeAt(0);
  return ((a * 41 + r * 59) % 38) + 5;
};

const RAW_DATA = REGIONS.reduce((acc, region) => {
  acc[region] = AGENTS.map((agent, i) => ({
    agent: `Agent ${agent}`,
    shortName: agent,
    color: AGENT_COLORS[i],
    active: seed(agent, region, 0),
    terminated: seed(agent, region, 7),
    get total() { return this.active + this.terminated; },
  }));
  return acc;
}, {});

// ── Custom Tooltip ──────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const pct = ((d.active / d.total) * 100).toFixed(0);
  return (
    <div style={{
      background: "#fff",
      border: `2px solid ${d.color}`,
      borderRadius: 10,
      padding: "14px 18px",
      boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
      fontFamily: "'Lato', sans-serif",
      minWidth: 190,
    }}>
      <p style={{ fontWeight: 700, color: "#1e293b", marginBottom: 10, fontSize: 13 }}>
        {d.agent}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
          <span style={{ fontSize: 12, color: "#16a34a", fontWeight: 600 }}>● Active</span>
          <span style={{ fontSize: 12, color: "#1e293b", fontWeight: 700 }}>{d.active} accounts</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
          <span style={{ fontSize: 12, color: "#dc2626", fontWeight: 600 }}>● Terminated</span>
          <span style={{ fontSize: 12, color: "#1e293b", fontWeight: 700 }}>{d.terminated} accounts</span>
        </div>
        <div style={{
          borderTop: "1px solid #f1f5f9", marginTop: 4, paddingTop: 6,
          display: "flex", justifyContent: "space-between", gap: 16,
        }}>
          <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>Total Sales</span>
          <span style={{ fontSize: 13, color: d.color, fontWeight: 900 }}>{d.total}</span>
        </div>
        <div style={{
          background: "#f8fafc", borderRadius: 6, padding: "4px 8px",
          fontSize: 11, color: "#64748b", textAlign: "center",
        }}>
          {pct}% retention rate
        </div>
      </div>
    </div>
  );
};

// ── Stacked Bar: Active (bottom) + Terminated (top) ────────────────────────
const ACTIVE_OPACITY = 1.0;
const TERM_OPACITY   = 0.38;

// ── Main Component ──────────────────────────────────────────────────────────
export default function SalesChart() {
  const [selectedRegion, setSelectedRegion] = useState("NCR");
  const [hoveredAgent, setHoveredAgent]     = useState(null);

  const chartData = useMemo(() => RAW_DATA[selectedRegion] || [], [selectedRegion]);

  const totalActive     = chartData.reduce((s, d) => s + d.active, 0);
  const totalTerminated = chartData.reduce((s, d) => s + d.terminated, 0);
  const totalSales      = totalActive + totalTerminated;
  const topAgent        = [...chartData].sort((a, b) => b.total - a.total)[0];
  const bottomAgent     = [...chartData].sort((a, b) => a.total - b.total)[0];

  return (
    <div style={{
      background: "#F8F9FC",
      minHeight: "100vh",
      fontFamily: "'Lato', sans-serif",
      padding: "32px 24px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&family=Merriweather:wght@700;900&display=swap');
        .region-btn { transition: all 0.18s ease; cursor: pointer; border: none; }
        .region-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(37,99,235,0.15); }
        .stat-card { transition: box-shadow 0.2s, transform 0.2s; }
        .stat-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.10) !important; transform: translateY(-2px); }
        .rank-item { transition: opacity 0.15s, transform 0.15s; cursor: default; }
        .rank-item:hover { transform: translateY(-1px); }
      `}</style>

      {/* ── Header ── */}
      <div style={{ maxWidth: 860, margin: "0 auto 28px" }}>
        <p style={{
          color: "#2563eb", fontSize: 11, letterSpacing: "0.2em",
          textTransform: "uppercase", fontWeight: 700, marginBottom: 6,
        }}>
          Broadband Sales Analytics · Philippines
        </p>
        <h1 style={{
          fontFamily: "'Merriweather', serif",
          fontSize: "clamp(20px, 3.5vw, 28px)",
          color: "#0f172a", fontWeight: 900,
          margin: "0 0 8px", lineHeight: 1.25,
        }}>
          Which Agents Made the Most Sales Per Region?
        </h1>
        <p style={{ color: "#64748b", fontSize: 13, margin: 0, lineHeight: 1.6 }}>
          Measuring <strong style={{ color: "#0f172a" }}>number of sales</strong> as
          COUNT of accounts with <span style={{ color: "#16a34a", fontWeight: 700 }}>Active</span> or{" "}
          <span style={{ color: "#dc2626", fontWeight: 700 }}>Terminated</span> status.
          Pending/processing accounts are excluded.
        </p>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto" }}>

        {/* ── Legend note ── */}
        <div style={{
          display: "flex", gap: 20, alignItems: "center",
          background: "#f8fafc", border: "1.5px solid #e2e8f0",
          borderRadius: 10, padding: "10px 18px", marginBottom: 20,
          flexWrap: "wrap",
        }}>
          <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.1em" }}>
            STATUS KEY:
          </span>
          {[
            { color: "#16a34a", label: "Active", desc: "Currently subscribed — confirmed sale" },
            { color: "#dc2626", label: "Terminated", desc: "Was a sale, subscription ended" },
            { color: "#94a3b8", label: "Excluded", desc: "Applied / Processing / On-hold" },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{
                width: 10, height: 10, borderRadius: 2,
                background: s.color, flexShrink: 0,
              }} />
              <span style={{ fontSize: 12, color: "#475569" }}>
                <strong style={{ color: s.color }}>{s.label}</strong> — {s.desc}
              </span>
            </div>
          ))}
        </div>

        {/* ── Region Selector ── */}
        <div style={{
          background: "#fff", border: "1.5px solid #e2e8f0",
          borderRadius: 14, padding: "16px 20px", marginBottom: 24,
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}>
          <p style={{
            fontSize: 11, fontWeight: 700, color: "#94a3b8",
            letterSpacing: "0.15em", marginBottom: 12,
          }}>
            FILTER BY REGION
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {REGIONS.map((region) => {
              const isActive = selectedRegion === region;
              return (
                <button key={region} className="region-btn"
                  onClick={() => setSelectedRegion(region)}
                  style={{
                    background: isActive ? "#2563eb" : "#fff",
                    color: isActive ? "#fff" : "#475569",
                    border: `1.5px solid ${isActive ? "#2563eb" : "#e2e8f0"}`,
                    borderRadius: 8, padding: "6px 14px",
                    fontSize: 12, fontWeight: isActive ? 700 : 400,
                    fontFamily: "'Lato', sans-serif",
                    boxShadow: isActive ? "0 2px 8px #2563eb40" : "none",
                  }}>
                  {region}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
          gap: 14, marginBottom: 24,
        }}>
          {[
            {
              label: "Region", value: selectedRegion,
              sub: "Selected region", color: "#2563eb",
            },
            {
              label: "Top Agent", value: topAgent?.agent || "—",
              sub: `${topAgent?.total || 0} total sales`, color: "#16a34a",
            },
            {
              label: "Active Accounts", value: totalActive,
              sub: `${((totalActive / totalSales) * 100).toFixed(0)}% of total sales`, color: "#16a34a",
            },
            {
              label: "Terminated Accounts", value: totalTerminated,
              sub: `${((totalTerminated / totalSales) * 100).toFixed(0)}% of total sales`, color: "#dc2626",
            },
          ].map((card, i) => (
            <div key={i} className="stat-card" style={{
              background: "#fff", border: "1.5px solid #e2e8f0",
              borderRadius: 12, padding: "14px 16px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              borderTop: `4px solid ${card.color}`,
            }}>
              <p style={{
                fontSize: 10, color: "#94a3b8", fontWeight: 700,
                letterSpacing: "0.12em", marginBottom: 6,
              }}>
                {card.label.toUpperCase()}
              </p>
              <p style={{
                fontSize: 17, fontWeight: 900, color: card.color,
                margin: "0 0 4px", fontFamily: "'Merriweather', serif",
              }}>
                {card.value}
              </p>
              <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{card.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Chart Panel ── */}
        <div style={{
          background: "#fff", border: "1.5px solid #e2e8f0",
          borderRadius: 14, padding: "28px 24px 20px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.05)", marginBottom: 20,
        }}>
          <div style={{ marginBottom: 16 }}>
            <h2 style={{
              fontFamily: "'Merriweather', serif", fontSize: 15,
              color: "#0f172a", margin: "0 0 4px",
            }}>
              Number of Sales by Agent —{" "}
              <span style={{ color: "#2563eb" }}>{selectedRegion}</span>
            </h2>
            <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>
              X-Axis: Agent (Categorical) · Y-Axis: COUNT of Accounts (Active + Terminated) ·
              Stacked by status · Hover bars for breakdown
            </p>
          </div>

          {/* Ranking strip */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            {[...chartData]
              .sort((a, b) => b.total - a.total)
              .map((d, i) => (
                <div key={d.agent} className="rank-item"
                  style={{
                    display: "flex", alignItems: "center", gap: 7,
                    background: i === 0 ? "#fefce8" : "#f8fafc",
                    border: `1.5px solid ${i === 0 ? "#fde68a" : "#e2e8f0"}`,
                    borderRadius: 8, padding: "6px 12px",
                    opacity: hoveredAgent && hoveredAgent !== d.shortName ? 0.4 : 1,
                  }}
                  onMouseEnter={() => setHoveredAgent(d.shortName)}
                  onMouseLeave={() => setHoveredAgent(null)}
                >
                  <span style={{
                    fontSize: 11, fontWeight: 700,
                    color: i === 0 ? "#d97706" : "#94a3b8",
                  }}>
                    {i === 0 ? "🏆" : `#${i + 1}`}
                  </span>
                  <span style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: d.color, flexShrink: 0,
                  }} />
                  <span style={{ fontSize: 12, color: "#475569", fontWeight: i === 0 ? 700 : 400 }}>
                    {d.agent}
                  </span>
                  <span style={{ fontSize: 12, color: d.color, fontWeight: 700 }}>
                    {d.total}
                  </span>
                  <span style={{ fontSize: 10, color: "#94a3b8" }}>
                    ({d.active}✓ {d.terminated}✗)
                  </span>
                </div>
              ))}
          </div>

          {/* Stacked Bar Chart */}
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={chartData}
              barCategoryGap="35%"
              margin={{ top: 20, right: 16, left: 10, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="agent"
                tick={{ fill: "#64748b", fontSize: 12, fontFamily: "Lato" }}
                axisLine={{ stroke: "#e2e8f0" }}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "#94a3b8", fontSize: 11, fontFamily: "Lato" }}
                axisLine={false}
                tickLine={false}
                label={{
                  value: "Number of Sales (Accounts)",
                  angle: -90, position: "insideLeft", offset: -2,
                  style: { fill: "#cbd5e1", fontSize: 10, fontFamily: "Lato" },
                }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />

              {/* Active — bottom stack */}
              <Bar dataKey="active" stackId="a" name="Active" radius={[0, 0, 6, 6]}>
                {chartData.map((entry, i) => (
                  <Cell
                    key={`active-${i}`}
                    fill={entry.color}
                    fillOpacity={
                      hoveredAgent === null || hoveredAgent === entry.shortName
                        ? ACTIVE_OPACITY : 0.15
                    }
                  />
                ))}
              </Bar>

              {/* Terminated — top stack */}
              <Bar dataKey="terminated" stackId="a" name="Terminated" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell
                    key={`term-${i}`}
                    fill={entry.color}
                    fillOpacity={
                      hoveredAgent === null || hoveredAgent === entry.shortName
                        ? TERM_OPACITY : 0.10
                    }
                  />
                ))}
                <LabelList
                  dataKey="total"
                  position="top"
                  content={({ x, y, width, value, index }) => {
                    const d = chartData[index];
                    if (!d) return null;
                    const dimmed = hoveredAgent && hoveredAgent !== d.shortName;
                    return (
                      <text
                        x={x + width / 2} y={y - 6}
                        textAnchor="middle"
                        fill={dimmed ? "#cbd5e1" : "#475569"}
                        fontSize={11}
                        fontWeight={700}
                        fontFamily="Lato"
                      >
                        {value}
                      </text>
                    );
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* In-chart legend */}
          <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 12 }}>
            {[
              { label: "Active accounts", opacity: ACTIVE_OPACITY },
              { label: "Terminated accounts", opacity: TERM_OPACITY },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{
                  width: 28, height: 12, borderRadius: 3,
                  background: "#64748b", opacity: item.opacity,
                  display: "inline-block",
                }} />
                <span style={{ fontSize: 11, color: "#64748b" }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Insight strip ── */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: 12, marginBottom: 20,
        }}>
          <div style={{
            background: "#f0fdf4", border: "1.5px solid #bbf7d0",
            borderRadius: 10, padding: "12px 16px",
          }}>
            <p style={{ fontSize: 11, color: "#16a34a", fontWeight: 700, margin: "0 0 4px", letterSpacing: "0.1em" }}>
              ▲ MOST SALES
            </p>
            <p style={{ fontSize: 13, color: "#14532d", fontWeight: 700, margin: "0 0 2px" }}>
              {topAgent?.agent} in {selectedRegion}
            </p>
            <p style={{ fontSize: 12, color: "#16a34a", margin: 0 }}>
              {topAgent?.total} total · {topAgent?.active} active · {topAgent?.terminated} terminated
            </p>
          </div>
          <div style={{
            background: "#fff7ed", border: "1.5px solid #fed7aa",
            borderRadius: 10, padding: "12px 16px",
          }}>
            <p style={{ fontSize: 11, color: "#d97706", fontWeight: 700, margin: "0 0 4px", letterSpacing: "0.1em" }}>
              ▼ FEWEST SALES
            </p>
            <p style={{ fontSize: 13, color: "#7c2d12", fontWeight: 700, margin: "0 0 2px" }}>
              {bottomAgent?.agent} in {selectedRegion}
            </p>
            <p style={{ fontSize: 12, color: "#d97706", margin: 0 }}>
              {bottomAgent?.total} total · {bottomAgent?.active} active · {bottomAgent?.terminated} terminated
            </p>
          </div>
        </div>

        {/* ── Footer ── */}
        <p style={{ fontSize: 11, color: "#9CA3AF", textAlign: "center", lineHeight: 1.7, fontFamily: "monospace" }}>
          * Sample data for visualization purposes · Metric: COUNT of Accounts (Status = Active or Terminated)
          <br />Excluded: Applied, Processing, On-hold · Hover ranking strip to highlight · Select region above to filter
        </p>
      </div>
    </div>
  );
}
