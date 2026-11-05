"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "motion/react";

gsap.registerPlugin(ScrollTrigger);

const stages = [
  {
    id: 1,
    headline: "Work is scattered across tools.",
    description:
      "Tasks, documents, meetings, and updates live in different places. Your team spends hours searching and syncing instead of moving forward.",
    visual: "scattered",
  },
  {
    id: 2,
    headline: "AI connects the dots.",
    description:
      "Your workspace brings relevant information together and highlights what matters. AI understands the relationships between your work.",
    visual: "connecting",
  },
  {
    id: 3,
    headline: "Your team moves forward.",
    description:
      "Clear priorities, connected knowledge, and actionable insights help your team work smarter. Every decision backed by real context.",
    visual: "unified",
  },
];

function ScatteredVisual() {
  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      {[
        { label: "Tasks", icon: "✓", x: "10%", y: "15%", color: "#EF4444", rot: -8 },
        { label: "Documents", icon: "📄", x: "55%", y: "8%", color: "#9297A5", rot: 5 },
        { label: "Calendar", icon: "📅", x: "5%", y: "55%", color: "#8B5CF6", rot: -4 },
        { label: "Messages", icon: "💬", x: "60%", y: "50%", color: "#4ADE80", rot: 6 },
        { label: "Updates", icon: "🔔", x: "30%", y: "72%", color: "#9297A5", rot: -3 },
      ].map((panel, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.12, duration: 0.5 }}
          style={{
            position: "absolute",
            left: panel.x,
            top: panel.y,
            background: "rgba(17,20,27,0.9)",
            border: `1px solid ${panel.color}28`,
            borderRadius: "10px",
            padding: "12px 16px",
            transform: `rotate(${panel.rot}deg)`,
            minWidth: "120px",
          }}
        >
          <div style={{ fontSize: "18px", marginBottom: "4px" }}>{panel.icon}</div>
          <div style={{ fontSize: "12px", fontWeight: 600, color: "#F5F5F7" }}>{panel.label}</div>
          <div style={{ fontSize: "10px", color: "#9297A5", marginTop: "2px" }}>Disconnected</div>
        </motion.div>
      ))}
    </div>
  );
}

function ConnectingVisual() {
  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      {/* Central AI node */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          background: "radial-gradient(circle, #FF6B6B, #EF4444)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 40px rgba(239, 68, 68,0.5)",
          zIndex: 10,
        }}
      >
        <span style={{ fontSize: "20px" }}>⚡</span>
      </motion.div>

      {/* SVG connection lines */}
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
        viewBox="0 0 400 320"
        preserveAspectRatio="xMidYMid meet"
      >
        {[
          { x1: 200, y1: 160, x2: 60, y2: 60 },
          { x1: 200, y1: 160, x2: 340, y2: 50 },
          { x1: 200, y1: 160, x2: 50, y2: 260 },
          { x1: 200, y1: 160, x2: 350, y2: 250 },
        ].map((line, i) => (
          <motion.line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#EF4444"
            strokeWidth="1.5"
            strokeOpacity="0.4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.4 + i * 0.12, duration: 0.5 }}
          />
        ))}
      </svg>

      {/* Panels moving toward center */}
      {[
        { label: "Tasks", x: "5%", y: "5%", color: "#EF4444" },
        { label: "Docs", x: "68%", y: "3%", color: "#9297A5" },
        { label: "Calendar", x: "3%", y: "62%", color: "#8B5CF6" },
        { label: "Messages", x: "70%", y: "60%", color: "#4ADE80" },
      ].map((panel, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
          style={{
            position: "absolute",
            left: panel.x,
            top: panel.y,
            background: "rgba(17,20,27,0.9)",
            border: `1px solid ${panel.color}30`,
            borderRadius: "10px",
            padding: "10px 14px",
          }}
        >
          <div style={{ fontSize: "11px", fontWeight: 600, color: panel.color }}>{panel.label}</div>
          <div style={{ fontSize: "9px", color: "#9297A5", marginTop: "2px" }}>Syncing...</div>
        </motion.div>
      ))}
    </div>
  );
}

function UnifiedVisual() {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        background: "rgba(13,15,20,0.95)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "14px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(8,9,13,0.5)",
        }}
      >
        <span style={{ fontSize: "12px", fontWeight: 700, color: "#F5F5F7" }}>Unified Workspace</span>
        <div
          style={{
            padding: "3px 8px",
            background: "rgba(74,222,128,0.1)",
            border: "1px solid rgba(74,222,128,0.2)",
            borderRadius: "4px",
            fontSize: "9px",
            color: "#4ADE80",
            fontWeight: 600,
          }}
        >
          Awaiting Data
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "14px", flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ minHeight: "145px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed rgba(255,255,255,0.08)", borderRadius: "8px", padding: "16px", color: "#9297A5", fontSize: "11px", textAlign: "center" }}>
          Project status will appear after workspace data is connected.
        </div>

        {/* AI recommendation */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          style={{
            background: "rgba(239, 68, 68,0.06)",
            border: "1px solid rgba(239, 68, 68,0.15)",
            borderRadius: "8px",
            padding: "10px 12px",
          }}
        >
          <div style={{ fontSize: "9px", fontWeight: 700, color: "#EF4444", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "4px" }}>
            AI Recommendation
          </div>
          <p style={{ fontSize: "11px", color: "#F5F5F7", lineHeight: 1.5 }}>
            Recommendations will appear after workspace data is connected.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

const visuals = {
  scattered: <ScatteredVisual />,
  connecting: <ConnectingVisual />,
  unified: <UnifiedVisual />,
};

export default function ScrollStorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStage, setActiveStage] = useState(0);
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      stages.forEach((_, i) => {
        ScrollTrigger.create({
          trigger: stageRefs.current[i],
          start: "top 55%",
          end: "bottom 45%",
          onEnter: () => setActiveStage(i),
          onEnterBack: () => setActiveStage(i),
        });
      });

      if (!prefersReduced) {
        gsap.fromTo(
          ".story-heading",
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="story"
      style={{ padding: "120px 24px", position: "relative", overflow: "hidden" }}
    >
      {/* Section heading */}
      <div className="story-heading" style={{ textAlign: "center", marginBottom: "80px" }}>
        <div className="pill-badge" style={{ marginBottom: "24px" }}>
          ✦ HOW IT WORKS
        </div>
        <h2
          style={{
            fontSize: "clamp(32px, 5vw, 60px)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            color: "#F5F5F7",
            lineHeight: 1.1,
          }}
        >
          From scattered work to
          <br />
          <span className="text-gradient-orange">shared momentum.</span>
        </h2>
      </div>

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "60px",
          alignItems: "start",
        }}
        className="story-grid"
      >
        {/* Left — Narrative stages */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {stages.map((stage, i) => (
            <div
              key={stage.id}
              ref={(el) => { stageRefs.current[i] = el; }}
              style={{
                padding: "40px 0",
                borderBottom: i < stages.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none",
                transition: "all 0.4s ease",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: activeStage === i ? "#EF4444" : "rgba(255,255,255,0.06)",
                    border: activeStage === i ? "none" : "1px solid rgba(255,255,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: activeStage === i ? "white" : "#9297A5",
                    transition: "all 0.4s ease",
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </div>
                <h3
                  style={{
                    fontSize: "clamp(18px, 2.5vw, 24px)",
                    fontWeight: 700,
                    color: activeStage === i ? "#F5F5F7" : "#9297A5",
                    letterSpacing: "-0.03em",
                    transition: "color 0.4s ease",
                    lineHeight: 1.2,
                  }}
                >
                  {stage.headline}
                </h3>
              </div>
              <p
                style={{
                  fontSize: "15px",
                  color: activeStage === i ? "#9297A5" : "rgba(146,151,165,0.5)",
                  lineHeight: 1.65,
                  paddingLeft: "44px",
                  transition: "color 0.4s ease",
                }}
              >
                {stage.description}
              </p>
            </div>
          ))}
        </div>

        {/* Right — Sticky visual */}
        <div
          style={{
            position: "sticky",
            top: "100px",
            height: "420px",
            background: "rgba(13,15,20,0.8)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            overflow: "hidden",
            padding: "16px",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStage}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              style={{ height: "100%" }}
            >
              {visuals[stages[activeStage].visual as keyof typeof visuals]}
            </motion.div>
          </AnimatePresence>

          {/* Stage indicator dots */}
          <div
            style={{
              position: "absolute",
              bottom: "16px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "6px",
            }}
          >
            {stages.map((_, i) => (
              <div
                key={i}
                style={{
                  width: activeStage === i ? "20px" : "6px",
                  height: "6px",
                  borderRadius: "3px",
                  background: activeStage === i ? "#EF4444" : "rgba(255,255,255,0.2)",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: show active stage visual below text */}
      <style>{`
        @media (max-width: 767px) {
          .story-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
