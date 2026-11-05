"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return;

      // Animate headline subtle float on scroll
      gsap.to(headlineRef.current, {
        y: -30,
        opacity: 0.9,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Animate dashboard scale up into full viewport view
      gsap.fromTo(
        dashboardRef.current,
        { scale: 0.95, y: 40, opacity: 0.85 },
        {
          scale: 1,
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: dashboardRef.current,
            start: "top 85%",
            end: "top 50%",
            scrub: 1.2,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "140px 24px 80px",
        overflow: "hidden",
      }}
    >
      {/* Background grid */}
      <div
        className="bg-grid"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.45,
          pointerEvents: "none",
        }}
      />

      {/* Ambient background lighting */}
      <div
        style={{
          position: "absolute",
          top: "8%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "720px",
          height: "320px",
          borderRadius: "50%",
          background: "radial-gradient(ellipse at 50% 30%, rgba(239, 68, 68, 0.12) 0%, transparent 70%)",
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
      />

      {/* Hero Header Content */}
      <div
        ref={headlineRef}
        style={{
          position: "relative",
          zIndex: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          maxWidth: "840px",
          width: "100%",
          marginBottom: "72px",
        }}
      >
        {/* Main Title - Refined Aesthetic Typography */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{
            fontSize: "clamp(40px, 6.5vw, 72px)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.035em",
            color: "#FFFFFF",
            marginBottom: "20px",
            fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
          }}
        >
          Intelligent Solutions
          <br />
          <span style={{ color: "#F5F5F7" }}>Powered by AI.</span>
        </motion.h1>

        {/* Supporting description */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            fontSize: "clamp(15px, 1.8vw, 17px)",
            color: "#8E93A0",
            maxWidth: "520px",
            lineHeight: 1.65,
            marginBottom: "36px",
            fontWeight: 400,
            letterSpacing: "-0.01em",
          }}
        >
          Gain clarity and harness the power of your data with RedSun.
          Our intuitive dashboard provides real-time analytics.
        </motion.p>

        {/* CTA buttons - Cleanly positioned above the solar arc */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            flexWrap: "wrap",
            justifyContent: "center",
            position: "relative",
            zIndex: 25,
          }}
        >
          <a href="#features" className="btn-subtle">
            Explore Platform
            <ArrowRight size={15} />
          </a>
          <a href="/register" className="btn-glow-orange">
            Get Started
          </a>
        </motion.div>
      </div>

      {/* ========================================================= */}
      {/* GLOWING SOLAR ECLIPSE ARC + FLOATING DASHBOARD */}
      {/* ========================================================= */}
      <div
        id="dashboard"
        ref={dashboardRef}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "1040px",
          zIndex: 10,
          marginTop: "16px",
        }}
      >
        {/* The Solar Arc Horizon Light Ring - Positioned cleanly below buttons and around dashboard */}
        <div
          style={{
            position: "absolute",
            top: "-70px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "min(920px, 92vw)",
            height: "360px",
            borderRadius: "50% 50% 0 0",
            borderTop: "2px solid rgba(239, 68, 68, 0.95)",
            background: "radial-gradient(ellipse at 50% 0%, rgba(239, 68, 68, 0.3) 0%, rgba(220, 38, 38, 0.08) 45%, transparent 75%)",
            boxShadow: "0 -6px 45px rgba(239, 68, 68, 0.65), 0 -20px 80px rgba(220, 38, 38, 0.3)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* Floating Dashboard Card */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            background: "rgba(13, 15, 21, 0.94)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "18px",
            boxShadow: "0 30px 100px rgba(0, 0, 0, 0.8), 0 0 60px rgba(239, 68, 68, 0.1)",
            overflow: "hidden",
          }}
        >
          {/* Dashboard Internal Navigation Bar */}
          <div
            style={{
              padding: "14px 22px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.07)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "rgba(9, 10, 15, 0.6)",
            }}
          >
            {/* Left: Brand logo in dashboard */}
            <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
              <Image src="/redsun-gradient-orbit-logo.png" alt="RedSun" width={64} height={43} style={{ width: "64px", height: "43px", objectFit: "contain" }} />

              {/* Nav items */}
              <div style={{ display: "flex", alignItems: "center", gap: "18px" }} className="hidden sm:flex">
                {[
                  { name: "Analytics", active: true },
                  { name: "Products" },
                  { name: "Customers" },
                  { name: "Campaigns" },
                  { name: "Settings" },
                ].map((item) => (
                  <span
                    key={item.name}
                    style={{
                      fontSize: "12px",
                      fontWeight: item.active ? 600 : 400,
                      color: item.active ? "#FFFFFF" : "#8E93A0",
                      cursor: "pointer",
                      paddingBottom: "2px",
                      borderBottom: item.active ? "2px solid #EF4444" : "2px solid transparent",
                    }}
                  >
                    {item.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Workspace / preview status */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 10px",
                  borderRadius: "100px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  fontSize: "11px",
                  color: "#8E93A0",
                }}
              >
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#9297A5" }} />
                <span>Preview</span>
              </div>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #EF4444, #8B5CF6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#FFFFFF",
                }}
              >
                RS
              </div>
            </div>
          </div>

          {/* Dashboard Main Grid Area */}
          <div
            style={{
              padding: "24px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))",
              gap: "20px",
            }}
          >
            {/* Left Card: Import Data into your Dashboard */}
            <div
              style={{
                background: "rgba(16, 19, 27, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.07)",
                borderRadius: "14px",
                padding: "20px",
              }}
            >
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#FFFFFF", marginBottom: "4px" }}>
                Import Data into your Dashboard
              </div>
              <div style={{ fontSize: "12px", color: "#8E93A0", marginBottom: "20px" }}>
                Connect data sources to populate your workspace.
              </div>

              {/* Integrations list */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "18px" }}>
                <div style={{ minHeight: "150px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", border: "1px dashed rgba(255,255,255,0.08)", borderRadius: "10px", color: "#8E93A0", fontSize: "12px", textAlign: "center" }}>
                  <span>No integrations connected.</span>
                  <button type="button" disabled style={{ padding: "6px 12px", fontSize: "11px", color: "#8E93A0", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", cursor: "not-allowed" }}>Connect an integration</button>
                </div>
              </div>

              {/* Bottom Action Dropdown */}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <span style={{ fontSize: "11px", color: "#8E93A0", cursor: "pointer" }}>Action ▾</span>
              </div>
            </div>

            {/* Right Card: Monthly Revenue Bar Chart */}
            <div
              style={{
                background: "rgba(16, 19, 27, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.07)",
                borderRadius: "14px",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#FFFFFF", marginBottom: "4px" }}>
                    Workspace Activity
                  </div>
                  <div style={{ fontSize: "14px", fontWeight: 650, color: "#8E93A0" }}>No data available</div>
                </div>
                <span style={{ fontSize: "11px", color: "#8E93A0", cursor: "pointer" }}>This week ▾</span>
              </div>

              {/* Glowing Bar Chart */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                <div
                  style={{
                    height: "140px",
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    gap: "8px",
                    paddingBottom: "8px",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", color: "#8E93A0", fontSize: "11px" }}>Activity analytics will appear when data is connected.</div>
                </div>

                {/* Day labels */}
                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "8px" }}>
                  <span style={{ fontSize: "10px", color: "#8E93A0" }}>No activity to display</span>
                </div>
              </div>
            </div>
          </div>
        </div>

            {/* Workspace integrations placeholder */}
        <div style={{ textAlign: "center", marginTop: "48px" }}>
          <p
            style={{
              fontSize: "12px",
              fontWeight: 500,
              color: "#8E93A0",
              letterSpacing: "0.04em",
              marginBottom: "24px",
            }}
          >
            Connect your workspace sources
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "clamp(24px, 4vw, 48px)",
              flexWrap: "wrap",
              opacity: 0.7,
            }}
          >
            <span style={{ color: "#8E93A0", fontSize: "12px" }}>Connected sources will appear here.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
