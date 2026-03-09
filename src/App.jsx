import { useState } from "react";
import GroupedBarChart from "./GroupedBarChart";
import RegionChartPlaceholder from "./RegionChartPlaceholder";

const VIEWS = {
  HOME: "home",
  AGE_SEX: "ageSex",
  REGION: "region",
};

const charts = [
  {
    id: 1,
    tag: "Question 1",
    title: "Age Group & Sex",
    subtitle: "Availed Broadband Subscribers",
    description:
      "Explore how broadband subscription uptake differs across customer age groups and sex using a grouped bar chart.",
    features: ["Grouped Bar Chart", "Interactive Legend", "Hover Tooltips"],
    icon: "👥",
    accent: "#2563EB",
    light: "#EFF6FF",
    view: VIEWS.AGE_SEX,
    disabled: false,
  },
  {
    id: 2,
    tag: "Question 2",
    title: "Region",
    subtitle: "Existing Broadband Users",
    description:
      "Compare the number of active broadband users across all Philippine regions using a horizontal bar chart.",
    features: ["Horizontal Bar Chart", "Sorted Rankings", "Regional Comparison"],
    icon: "🗺️",
    accent: "#0E7490",
    light: "#ECFEFF",
    view: VIEWS.REGION,
    disabled: false,
  },
  {
    id: 3,
    tag: "Question 3",
    title: "Agent Sales",
    subtitle: "Per Region Performance",
    description:
      "Identify top-performing sales agents across different regions and compare their broadband sales output.",
    features: ["Coming Soon"],
    icon: "🏆",
    accent: "#7C3AED",
    light: "#F5F3FF",
    disabled: true,
  },
  {
    id: 4,
    tag: "Question 4",
    title: "Installation Time",
    subtitle: "vs. Regional Average",
    description:
      "Visualize how long broadband service installation takes per region relative to the overall average.",
    features: ["Coming Soon"],
    icon: "⏱️",
    accent: "#B45309",
    light: "#FFFBEB",
    disabled: true,
  },
  {
    id: 5,
    tag: "Question 5",
    title: "Account Status",
    subtitle: "Per Agent Per Region",
    description:
      "See a breakdown of account statuses across agents and regions in a single unified view.",
    features: ["Coming Soon"],
    icon: "📊",
    accent: "#065F46",
    light: "#ECFDF5",
    disabled: true,
  },
  {
    id: 6,
    tag: "Question 6",
    title: "Account Tenure",
    subtitle: "By Status & Region",
    description:
      "Understand the tenure distribution of accounts in different statuses across all regions.",
    features: ["Coming Soon"],
    icon: "📅",
    accent: "#9F1239",
    light: "#FFF1F2",
    disabled: true,
  },
];

const backButtonStyle = {
  position: "fixed",
  top: 24,
  left: 24,
  padding: "8px 14px",
  borderRadius: 999,
  border: "1px solid rgba(148,163,184,0.7)",
  background: "rgba(15,23,42,0.9)",
  color: "#E5E7EB",
  fontSize: 12,
  fontFamily:
    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  cursor: "pointer",
  boxShadow: "0 12px 30px rgba(15,23,42,0.7)",
};

const backButtonHoverStyle = {
  ...backButtonStyle,
  background: "rgba(15,23,42,1)",
};

function App() {
  const [view, setView] = useState(VIEWS.HOME);
  const [isBackHovered, setIsBackHovered] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  if (view === VIEWS.AGE_SEX) {
    return (
      <>
        <button
          type="button"
          onClick={() => setView(VIEWS.HOME)}
          style={isBackHovered ? backButtonHoverStyle : backButtonStyle}
          onMouseEnter={() => setIsBackHovered(true)}
          onMouseLeave={() => setIsBackHovered(false)}
        >
          ← Back to menu
        </button>
        <GroupedBarChart />
      </>
    );
  }

  if (view === VIEWS.REGION) {
    return (
      <>
        <button
          type="button"
          onClick={() => setView(VIEWS.HOME)}
          style={isBackHovered ? backButtonHoverStyle : backButtonStyle}
          onMouseEnter={() => setIsBackHovered(true)}
          onMouseLeave={() => setIsBackHovered(false)}
        >
          ← Back to menu
        </button>
        <RegionChartPlaceholder />
      </>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8F4E7",
        fontFamily: "'Georgia', serif",
        padding: "48px 0 64px",
      }}
    >
      {/* Hero Header */}
      <div
        style={{
          textAlign: "center",
          padding: "64px 24px 48px",
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 999,
            padding: "6px 18px",
            fontSize: 11,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#94A3B8",
            fontFamily: "monospace",
            marginBottom: 24,
          }}
        >
          CMSC 176 · Case Study 3 · Data Visualization
        </div>

        <h1
          style={{
            fontSize: 38,
            fontWeight: "bold",
            color: "#111827",
            margin: "0 0 16px",
            lineHeight: 1.2,
            letterSpacing: "-0.5px",
          }}
        >
          Broadband Service
          <span
            style={{
              display: "block",
              background: "linear-gradient(90deg, #38BDF8, #818CF8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Subscription Analysis
          </span>
        </h1>

        <p
          style={{
            color: "#4B5563",
            fontSize: 15,
            maxWidth: 520,
            margin: "0 auto",
            lineHeight: 1.7,
          }}
        >
          Six visualization exercises exploring broadband service data across age
          groups, regions, agents, and account statuses in the Philippines.
        </p>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 32,
            marginTop: 36,
            flexWrap: "wrap",
          }}
        >
          {[
            { value: "6", label: "Questions" },
            { value: "10", label: "Variables" },
            { value: "17", label: "Regions" },
          ].map(({ value, label }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div
                style={{ fontSize: 28, fontWeight: "bold", color: "#F8FAFC" }}
              >
                {value}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#64748B",
                  fontFamily: "monospace",
                  letterSpacing: 1,
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          maxWidth: 800,
          margin: "0 auto 40px",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div
          style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }}
        />
        <span
          style={{
            color: "#475569",
            fontSize: 11,
            fontFamily: "monospace",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          Select a Visualization
        </span>
        <div
          style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }}
        />
      </div>

      {/* Cards Grid */}
      <div
        style={{
          maxWidth: 860,
          margin: "0 auto",
          padding: "0 24px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 20,
        }}
      >
        {charts.map((chart) => {
          const isHovered = hoveredCard === chart.id;
          const isDisabled = chart.disabled;

          return (
            <button
              key={chart.id}
              type="button"
              disabled={isDisabled}
              onClick={() => {
                if (!isDisabled && chart.view) {
                  setView(chart.view);
                }
              }}
              onMouseEnter={() => !isDisabled && setHoveredCard(chart.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                textAlign: "left",
                background: isHovered
                  ? `linear-gradient(135deg, ${chart.light}80, #FFFFFF)`
                  : "#FFFFFF",
                border: isHovered
                  ? `1px solid ${chart.accent}60`
                  : "1px solid rgba(148,163,184,0.45)",
                borderRadius: 16,
                padding: 24,
                cursor: isDisabled ? "not-allowed" : "pointer",
                transition: "all 0.25s ease",
                opacity: isDisabled ? 0.45 : 1,
                transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                boxShadow: isHovered
                  ? `0 12px 32px ${chart.accent}22`
                  : "0 8px 20px rgba(15,23,42,0.06)",
                color: "#111827",
              }}
            >
              {/* Icon + Tag */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: `${chart.accent}22`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                  }}
                >
                  {chart.icon}
                </div>
                <span
                  style={{
                    background: isDisabled
                      ? "rgba(148,163,184,0.1)"
                      : `${chart.accent}22`,
                    color: isDisabled ? "#64748B" : chart.accent,
                    border: `1px solid ${isDisabled
                      ? "rgba(148,163,184,0.4)"
                      : chart.accent + "44"
                      }`,
                    borderRadius: 999,
                    padding: "3px 10px",
                    fontSize: 10,
                    fontFamily: "monospace",
                    letterSpacing: 1,
                  }}
                >
                  {chart.tag}
                </span>
              </div>

              {/* Title */}
              <h3
                style={{
                  fontSize: 17,
                  fontWeight: "bold",
                  color: "#F1F5F9",
                  margin: "0 0 4px",
                }}
              >
                {chart.title}
              </h3>
              <p
                style={{
                  fontSize: 12,
                  color: chart.accent,
                  margin: "0 0 12px",
                  fontFamily: "monospace",
                  letterSpacing: 0.5,
                }}
              >
                {chart.subtitle}
              </p>

              {/* Description */}
              <p
                style={{
                  fontSize: 13,
                  color: "#4B5563",
                  lineHeight: 1.6,
                  margin: "0 0 16px",
                }}
              >
                {chart.description}
              </p>

              {/* Feature Pills */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {chart.features.map((f) => (
                  <span
                    key={f}
                    style={{
                      background: "rgba(249,250,251,0.9)",
                      border: "1px solid rgba(209,213,219,0.9)",
                      borderRadius: 999,
                      padding: "3px 10px",
                      fontSize: 10,
                      color: "#6B7280",
                      fontFamily: "monospace",
                    }}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div
        style={{
          textAlign: "center",
          marginTop: 56,
          color: "#334155",
          fontSize: 11,
          fontFamily: "monospace",
          letterSpacing: 1,
        }}
      >
        CMSC 176 · Data Science · Visualization Exercises
      </div>
    </div>
  );
}

export default App;
