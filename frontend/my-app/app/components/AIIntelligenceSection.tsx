"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";
import { Zap, FileText, Calendar, GitBranch } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const modules = [
  {
    id: "projects",
    label: "PROJECTS",
    icon: <GitBranch size={18} />,
    description: "Project progress, task dependencies, and blockers",
    angle: -90, // top
    color: "#EF4444",
    detail: "No data connected",
  },
  {
    id: "meetings",
    label: "MEETINGS",
    icon: <Calendar size={18} />,
    description: "Summaries, decisions, and action items",
    angle: 0, // right
    color: "#8B5CF6",
    detail: "No data connected",
  },
  {
    id: "knowledge",
    label: "KNOWLEDGE",
    icon: <FileText size={18} />,
    description: "Connected docs, search, and relevant answers",
    angle: 90, // bottom
    color: "#4ADE80",
    detail: "No data connected",
  },
  {
    id: "automation",
    label: "AUTOMATION",
    icon: <Zap size={18} />,
    description: "Connected workflow steps and automated actions",
    angle: 180, // left
    color: "#EF4444",
    detail: "No data connected",
  },
];

function polarToXY(angleDeg: number, radius: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: Math.cos(rad) * radius,
    y: Math.sin(rad) * radius,
  };
}

export default function AIIntelligenceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const moduleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const linesRef = useRef<SVGSVGElement>(null);
  const insightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
          toggleActions: "play none none reverse",
        },
      });

      // Core illuminates
      tl.fromTo(
        coreRef.current,
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.4)" }
      );

      // Modules enter
      tl.fromTo(
        moduleRefs.current.filter(Boolean),
        { scale: 0.6, opacity: 0 },
        { scale: 1, opacity: 1, stagger: 0.15, duration: 0.6, ease: "back.out(1.2)" },
        "-=0.4"
      );

      // Lines draw
      const lines = linesRef.current?.querySelectorAll("line");
      if (lines) {
        lines.forEach((line) => {
          const len = 200;
          gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
          tl.to(line, { strokeDashoffset: 0, duration: 0.6, ease: "power2.out" }, "-=0.4");
        });
      }

      // Insight slides in
      tl.fromTo(
        insightRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        "-=0.2"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const radius = 160;
  const svgSize = 480;
  const center = svgSize / 2;

  return (
    <section
      ref={sectionRef}
      id="intelligence"
      className="section-padding"
      style={{ position: "relative", overflow: "hidden", padding: "120px 24px" }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "700px",
          height: "700px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: "80px" }}
        >
          <div className="pill-badge" style={{ marginBottom: "24px" }}>
            ✦ AI INTELLIGENCE
          </div>
          <h2
            style={{
              fontSize: "clamp(32px, 5vw, 60px)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: "#F5F5F7",
              marginBottom: "16px",
              lineHeight: 1.1,
            }}
          >
            Your team&apos;s intelligence,
            <br />
            <span className="text-gradient-orange">finally connected.</span>
          </h2>
          <p style={{ fontSize: "17px", color: "#9297A5", maxWidth: "520px", margin: "0 auto", lineHeight: 1.65 }}>
            Connect the information your team already has and turn it into clear, actionable insights.
          </p>
        </motion.div>

        {/* Visualization */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "40px",
          }}
        >
          <div style={{ position: "relative", width: `${svgSize}px`, height: `${svgSize}px`, maxWidth: "100%" }}>
            {/* SVG lines */}
            <svg
              ref={linesRef}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
              viewBox={`0 0 ${svgSize} ${svgSize}`}
            >
              {modules.map((mod) => {
                const pos = polarToXY(mod.angle, radius);
                return (
                  <line
                    key={mod.id}
                    x1={center}
                    y1={center}
                    x2={center + pos.x}
                    y2={center + pos.y}
                    stroke={mod.color}
                    strokeWidth="1.5"
                    strokeOpacity="0.4"
                    strokeDasharray="200"
                    strokeDashoffset="200"
                  />
                );
              })}
              {/* Outer circle hint */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
                fill="none"
                strokeDasharray="4 6"
              />
            </svg>

            {/* AI Core */}
            <div
              ref={coreRef}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.06, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(239, 68, 68,0.6) 0%, rgba(239, 68, 68,0.2) 50%, transparent 70%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #FF6B6B 0%, #EF4444 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 40px rgba(239, 68, 68,0.5)",
                  }}
                >
                  <Zap size={24} color="white" />
                </div>
              </motion.div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#EF4444", letterSpacing: "0.1em", marginTop: "8px", textTransform: "uppercase" }}>
                Nexora AI
              </div>
            </div>

            {/* Module nodes */}
            {modules.map((mod, i) => {
              const pos = polarToXY(mod.angle, radius);
              const nodeX = center + pos.x;
              const nodeY = center + pos.y;
              const nodeW = 120;

              return (
                <div
                  key={mod.id}
                  ref={(el) => { moduleRefs.current[i] = el; }}
                  style={{
                    position: "absolute",
                    left: `${nodeX}px`,
                    top: `${nodeY}px`,
                    transform: "translate(-50%, -50%)",
                    width: `${nodeW}px`,
                    background: "rgba(17,20,27,0.9)",
                    backdropFilter: "blur(12px)",
                    border: `1px solid ${mod.color}28`,
                    borderRadius: "12px",
                    padding: "12px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 32,
                      height: 32,
                      borderRadius: "8px",
                      background: `${mod.color}14`,
                      color: mod.color,
                      margin: "0 auto 6px",
                    }}
                  >
                    {mod.icon}
                  </div>
                  <div style={{ fontSize: "9px", fontWeight: 700, color: mod.color, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>
                    {mod.label}
                  </div>
                  <div style={{ fontSize: "9px", color: "#9297A5" }}>{mod.detail}</div>
                </div>
              );
            })}
          </div>

          {/* AI Generated Insight */}
          <div
            ref={insightRef}
            style={{
              maxWidth: "600px",
              width: "100%",
              background: "rgba(239, 68, 68,0.05)",
              border: "1px solid rgba(239, 68, 68,0.15)",
              borderRadius: "14px",
              padding: "20px 24px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <motion.div
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ width: 8, height: 8, borderRadius: "50%", background: "#EF4444" }}
              />
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#EF4444", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                AI-Generated Insight
              </span>
            </div>
            <p style={{ fontSize: "14px", color: "#F5F5F7", lineHeight: 1.6, marginBottom: "12px" }}>
              Workspace insights will appear here after your project, task, and team data is connected.
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                style={{
                  padding: "7px 14px",
                  background: "#EF4444",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Assign Tasks
              </button>
              <button
                style={{
                  padding: "7px 14px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "6px",
                  fontSize: "12px",
                  color: "#9297A5",
                  cursor: "pointer",
                }}
              >
                View Context
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
