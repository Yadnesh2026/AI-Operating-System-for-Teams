"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, TrendingUp, Sliders, Layers } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function FeatureGrid() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return;

      gsap.fromTo(
        ".bento-item",
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      style={{
        padding: "100px 20px 80px",
        position: "relative",
        background: "#07080B",
      }}
    >
      <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
        {/* Section Pill + Heading */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div className="pill-badge" style={{ marginBottom: "20px" }}>
            ✦ BENTO ARCHITECTURE
          </div>
          <h2
            style={{
              fontSize: "clamp(34px, 5vw, 56px)",
              fontWeight: 800,
              letterSpacing: "-0.035em",
              color: "#FFFFFF",
              lineHeight: 1.15,
              marginBottom: "16px",
            }}
          >
            Intelligent building blocks for
            <br />
            <span style={{ color: "#EF4444" }}>hyper-productive teams.</span>
          </h2>
          <p style={{ fontSize: "16px", color: "#8E93A0", maxWidth: "500px", margin: "0 auto" }}>
            Explore the frontier of automated work with smart analytics, live sessions, and automated dispatching.
          </p>
        </div>

        {/* Bento Grid Layout - Exactly matching Video Frame 8.2s */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: "20px",
          }}
        >
          {/* ========================================= */}
          {/* CARD 1: Balance (From Video) */}
          {/* ========================================= */}
          <div
            className="bento-item glass-card"
            style={{
              gridColumn: "span 4",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "280px",
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ fontSize: "15px", fontWeight: 700, color: "#FFFFFF" }}>Balance</span>
                <Sliders size={16} color="#EF4444" />
              </div>
              <p style={{ fontSize: "12px", color: "#8E93A0", lineHeight: 1.5, marginBottom: "24px" }}>
                Monitor resource allocations, velocity buffers, and team delivery bandwidth in real-time.
              </p>
            </div>

            {/* Interactive Slider & HSBC Prototype task from video */}
            <div>
              <div
                style={{
                  height: "28px",
                  background: "linear-gradient(90deg, rgba(239, 68, 68, 0.4) 0%, rgba(239, 68, 68, 0.8) 70%, transparent 100%)",
                  borderRadius: "6px",
                  border: "1px solid rgba(239, 68, 68, 0.5)",
                  display: "flex",
                  alignItems: "center",
                  padding: "0 10px",
                  marginBottom: "14px",
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#FFFFFF", boxShadow: "0 0 10px #FFFFFF" }} />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 12px",
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.07)",
                  borderRadius: "8px",
                }}
              >
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E" }} />
                <span style={{ fontSize: "11px", fontWeight: 600, color: "#FFFFFF" }}>HSBC-01</span>
                <span style={{ fontSize: "11px", color: "#8E93A0" }}>Create a working prototype</span>
              </div>
            </div>
          </div>

          {/* ========================================= */}
          {/* CARD 2: Users (From Video) */}
          {/* ========================================= */}
          <div
            className="bento-item glass-card"
            style={{
              gridColumn: "span 4",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "280px",
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ fontSize: "15px", fontWeight: 700, color: "#FFFFFF" }}>Users</span>
                <TrendingUp size={16} color="#22C55E" />
              </div>
              <p style={{ fontSize: "12px", color: "#8E93A0", lineHeight: 1.5, marginBottom: "20px" }}>
                Autonomous tracking of active sessions and authenticated workspace collaborators.
              </p>
            </div>

            {/* Sparkline metrics container from video */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                borderRadius: "12px",
                padding: "16px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "12px" }}>
                <div>
                  <div style={{ fontSize: "10px", color: "#8E93A0", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    TOTAL USERS
                  </div>
                  <div style={{ fontSize: "24px", fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.02em" }}>
                    72,350
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "3px 8px",
                    borderRadius: "100px",
                    background: "rgba(34, 197, 94, 0.12)",
                    border: "1px solid rgba(34, 197, 94, 0.25)",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#22C55E",
                  }}
                >
                  ↑ 5.9%
                </div>
              </div>

              {/* Sparkline SVG */}
              <svg width="100%" height="34" viewBox="0 0 200 40" fill="none">
                <path
                  d="M0 32 L30 28 L60 30 L90 18 L120 22 L150 10 L180 14 L200 4"
                  stroke="#EF4444"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="200" cy="4" r="3.5" fill="#EF4444" />
              </svg>
            </div>
          </div>

          {/* ========================================= */}
          {/* CARD 4 (Right Tall): Create with Funnel Light (From Video) */}
          {/* ========================================= */}
          <div
            className="bento-item glass-card"
            style={{
              gridColumn: "span 4",
              gridRow: "span 2",
              padding: "28px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Radiant Orange Light Beam Funnel from Video */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: "240px",
                height: "260px",
                background: "radial-gradient(ellipse at 50% 0%, rgba(239, 68, 68, 0.45) 0%, rgba(220, 38, 38, 0.15) 50%, transparent 80%)",
                clipPath: "polygon(10% 0%, 90% 0%, 65% 100%, 35% 100%)",
                pointerEvents: "none",
              }}
            />

            {/* Funnel beam lines */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: "180px",
                height: "220px",
                background: "repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(239, 68, 68, 0.15) 10px, rgba(239, 68, 68, 0.15) 12px)",
                clipPath: "polygon(15% 0%, 85% 0%, 60% 100%, 40% 100%)",
                pointerEvents: "none",
              }}
            />

            {/* Glowing Shield / Hexagon core at the bottom of the funnel */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                paddingTop: "60px",
                paddingBottom: "40px",
                position: "relative",
                zIndex: 2,
              }}
            >
              <div
                style={{
                  width: "68px",
                  height: "68px",
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 0.9))",
                  border: "2px solid rgba(255, 255, 255, 0.4)",
                  boxShadow: "0 0 35px rgba(239, 68, 68, 0.9), 0 0 70px rgba(220, 38, 38, 0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Layers size={32} color="#FFFFFF" />
              </div>
            </div>

            {/* Bottom Content */}
            <div style={{ position: "relative", zIndex: 2 }}>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "#FFFFFF", marginBottom: "8px" }}>
                Create
              </div>
              <p style={{ fontSize: "13px", color: "#8E93A0", lineHeight: 1.6, marginBottom: "20px" }}>
                Auto-generate sprints, tasks, and code components instantly with connected intelligence.
              </p>
              <a
                href="#ai-demo"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#EF4444",
                  textDecoration: "none",
                }}
              >
                Try Interactive Assistant →
              </a>
            </div>
          </div>

          {/* ========================================= */}
          {/* CARD 3: AI Sessions (From Video) */}
          {/* ========================================= */}
          <div
            className="bento-item glass-card"
            style={{
              gridColumn: "span 8",
              padding: "26px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "24px",
              alignItems: "center",
              minHeight: "220px",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <span style={{ fontSize: "16px", fontWeight: 700, color: "#FFFFFF" }}>AI Sessions</span>
                <span
                  style={{
                    fontSize: "10px",
                    padding: "2px 8px",
                    borderRadius: "100px",
                    background: "rgba(239, 68, 68, 0.15)",
                    color: "#EF4444",
                    fontWeight: 600,
                  }}
                >
                  Live
                </span>
              </div>
              <p style={{ fontSize: "13px", color: "#8E93A0", lineHeight: 1.6 }}>
                Real-time agentic collaboration across all team issues, repositories, and release pipelines.
              </p>
            </div>

            {/* Floating context popup with sparkle stars from video */}
            <div
              style={{
                position: "relative",
                background: "rgba(10, 12, 17, 0.95)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                padding: "14px 16px",
                boxShadow: "0 14px 40px rgba(0, 0, 0, 0.6)",
              }}
            >
              {/* Magic sparkle star icon */}
              <div
                style={{
                  position: "absolute",
                  top: "14px",
                  right: "16px",
                  display: "flex",
                  gap: "4px",
                }}
              >
                <Sparkles size={20} color="#FFFFFF" />
              </div>

              {/* Items from video */}
              <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "2px", background: "#EF4444" }} />
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "#FFFFFF" }}>Personal •</span>
                </div>
                {["Issues", "Active", "Backlog", "Projects"].map((subItem) => (
                  <div key={subItem} style={{ fontSize: "12px", color: "#8E93A0", paddingLeft: "16px" }}>
                    {subItem}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Breakpoints */}
      <style>{`
        @media (max-width: 900px) {
          .bento-item {
            grid-column: span 12 !important;
            grid-row: auto !important;
          }
        }
      `}</style>
    </section>
  );
}
