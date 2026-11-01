"use client";

import { useRef, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const integrations = [
  {
    name: "Flask",
    type: "Users",
    color: "#FF5555",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF5555" strokeWidth="2">
        <path d="M10 2v7.31L4.66 19.3A2 2 0 0 0 6.34 22h11.32a2 2 0 0 0 1.68-2.7L14 9.31V2" />
        <path d="M8.5 2h7" />
        <path d="M7 16h10" />
      </svg>
    ),
  },
  {
    name: "Porta",
    type: "Users",
    color: "#38BDF8",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2">
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M9 3v18" />
      </svg>
    ),
  },
  {
    name: "Hunter",
    type: "Users",
    color: "#2DD4BF",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2DD4BF" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="22" x2="18" y1="12" y2="12" />
        <line x1="6" x2="2" y1="12" y2="12" />
        <line x1="12" x2="12" y1="6" y2="2" />
        <line x1="12" x2="12" y1="22" y2="18" />
      </svg>
    ),
  },
];

const revenueBars = [
  { day: "Day", height: "48%" },
  { day: "Mon", height: "24%" },
  { day: "Tue", height: "65%" },
  { day: "Wed", height: "42%" },
  { day: "Thu", height: "80%" },
  { day: "Fri", height: "55%" },
  { day: "Sat", height: "92%" },
  { day: "Sun", height: "68%" },
];

const partnerLogos = [
  { name: "Trace", icon: "◎" },
  { name: "Volume", icon: "◒" },
  { name: "Clues", icon: "✦" },
  { name: "Rise", icon: "▲" },
  { name: "Cloud", icon: "☁" },
  { name: "Trace", icon: "◎" },
  { name: "Clues", icon: "✦" },
  { name: "Rise", icon: "▲" },
];

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
          background: "radial-gradient(ellipse at 50% 30%, rgba(255, 122, 26, 0.12) 0%, transparent 70%)",
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
          <a href="#dashboard" className="btn-glow-orange">
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
            borderTop: "2px solid rgba(255, 154, 74, 0.95)",
            background: "radial-gradient(ellipse at 50% 0%, rgba(255, 122, 26, 0.3) 0%, rgba(255, 80, 0, 0.08) 45%, transparent 75%)",
            boxShadow: "0 -6px 45px rgba(255, 122, 26, 0.65), 0 -20px 80px rgba(255, 90, 0, 0.3)",
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
            boxShadow: "0 30px 100px rgba(0, 0, 0, 0.8), 0 0 60px rgba(255, 122, 26, 0.1)",
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
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "14px", fontWeight: 800, color: "#FFFFFF" }}>REDSUN</span>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#FF7A1A", boxShadow: "0 0 8px #FF7A1A" }} />
              </div>

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
                      borderBottom: item.active ? "2px solid #FF7A1A" : "2px solid transparent",
                    }}
                  >
                    {item.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: User / status icon */}
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
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E" }} />
                <span>Live Feed</span>
              </div>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #FF7A1A, #8B5CF6)",
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
                Sync and link to your store and train immediately
              </div>

              {/* Integrations list */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "18px" }}>
                {integrations.map((item) => (
                  <div
                    key={item.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      background: "rgba(255, 255, 255, 0.025)",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                      borderRadius: "10px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "8px",
                          background: "rgba(255, 255, 255, 0.04)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: 600, color: "#FFFFFF" }}>{item.name}</div>
                        <div style={{ fontSize: "11px", color: "#8E93A0" }}>{item.type}</div>
                      </div>
                    </div>

                    <button
                      style={{
                        padding: "5px 12px",
                        fontSize: "11px",
                        fontWeight: 500,
                        color: "#FFFFFF",
                        background: "rgba(255, 255, 255, 0.06)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "6px",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.background = "rgba(255, 122, 26, 0.15)";
                        (e.target as HTMLElement).style.borderColor = "rgba(255, 122, 26, 0.3)";
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.background = "rgba(255, 255, 255, 0.06)";
                        (e.target as HTMLElement).style.borderColor = "rgba(255, 255, 255, 0.1)";
                      }}
                    >
                      Launch Importer
                    </button>
                  </div>
                ))}
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
                    Monthly Revenue
                  </div>
                  <div style={{ fontSize: "20px", fontWeight: 800, color: "#FF7A1A" }}>$84,250</div>
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
                  {revenueBars.map((bar, i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        height: "100%",
                        justifyContent: "flex-end",
                      }}
                    >
                      <motion.div
                        initial={{ height: 0 }}
                        whileInView={{ height: bar.height }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: i * 0.08, ease: "easeOut" }}
                        style={{
                          width: "100%",
                          maxWidth: "14px",
                          borderRadius: "4px 4px 0 0",
                          background: i === 6 ? "linear-gradient(180deg, #FF9A4A 0%, #FF7A1A 100%)" : "rgba(255, 122, 26, 0.45)",
                          boxShadow: i === 6 ? "0 0 16px rgba(255, 122, 26, 0.8)" : "none",
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Day labels */}
                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "8px" }}>
                  {revenueBars.map((bar, i) => (
                    <span key={i} style={{ flex: 1, textAlign: "center", fontSize: "10px", color: "#8E93A0" }}>
                      {bar.day}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LOGO MARQUEE: "Join 4,000+ companies already growing" */}
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
            Join 4,000+ companies already growing
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
            {partnerLogos.map((logo, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#FFFFFF",
                }}
              >
                <span style={{ fontSize: "12px", color: "#FF7A1A" }}>{logo.icon}</span>
                <span>{logo.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
