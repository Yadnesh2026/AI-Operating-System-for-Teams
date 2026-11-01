"use client";

import { useRef, useEffect } from "react";
import { Check, ArrowRight, ShieldCheck, MessageSquare, Zap } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const checklistItems = [
  "Customizable layouts for efficient coding",
  "Font preferences to match your style",
  "Create multiple profiles for versatility",
];

export default function TopManagementSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return;

      gsap.fromTo(
        ".mgmt-reveal",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
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
      style={{
        padding: "100px 20px",
        position: "relative",
        background: "#07080B",
        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
      }}
    >
      <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
        {/* Section Header from Video Frame 11.1s */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <h2
            className="mgmt-reveal"
            style={{
              fontSize: "clamp(34px, 5vw, 56px)",
              fontWeight: 800,
              letterSpacing: "-0.035em",
              color: "#FFFFFF",
              lineHeight: 1.15,
              marginBottom: "16px",
            }}
          >
            Powerful Features
          </h2>
          <p
            className="mgmt-reveal"
            style={{
              fontSize: "16px",
              color: "#8E93A0",
              maxWidth: "580px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Explore the frontier of coding evolution with RedSun Unleashed.
            Our latest features redefine the boundaries of what&apos;s possible in coding tools.
          </p>
        </div>

        {/* Split Card Layout from Video Frame 11.1s */}
        <div
          className="glass-card"
          style={{
            padding: "clamp(28px, 5vw, 48px)",
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: "48px",
            alignItems: "center",
          }}
        >
          {/* Left Column: Management & Checklist */}
          <div>
            <h3
              style={{
                fontSize: "clamp(22px, 3vw, 32px)",
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: "-0.03em",
                lineHeight: 1.25,
                marginBottom: "16px",
              }}
            >
              Top Management, to help you see the bigger picture
            </h3>

            <p style={{ fontSize: "14px", color: "#8E93A0", lineHeight: 1.65, marginBottom: "28px" }}>
              Coordinate multiple engineers, cross-functional sprints, and code reviews
              with autonomous task prioritization and context preservation.
            </p>

            <div style={{ marginBottom: "32px" }}>
              <a
                href="#dashboard"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 18px",
                  borderRadius: "100px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#FFFFFF",
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
              >
                See Doc
                <ArrowRight size={14} />
              </a>
            </div>

            {/* Checklist items with orange checked boxes from video */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {checklistItems.map((item, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "5px",
                      background: "rgba(255, 122, 26, 0.2)",
                      border: "1.5px solid #FF7A1A",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#FF7A1A",
                      flexShrink: 0,
                    }}
                  >
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span style={{ fontSize: "14px", fontWeight: 500, color: "#F5F5F7" }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Glowing Orbital Shield Visual from Video */}
          <div
            style={{
              position: "relative",
              minHeight: "340px",
              background: "rgba(10, 12, 17, 0.9)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "16px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              overflow: "hidden",
            }}
          >
            {/* Circular Glowing Radar Arc from Video */}
            <div
              style={{
                position: "absolute",
                bottom: "-60px",
                right: "-60px",
                width: "300px",
                height: "300px",
                borderRadius: "50%",
                border: "2px solid rgba(255, 122, 26, 0.8)",
                background: "radial-gradient(circle, rgba(255, 122, 26, 0.3) 0%, rgba(255, 70, 0, 0.08) 50%, transparent 75%)",
                boxShadow: "0 0 50px rgba(255, 122, 26, 0.4)",
                pointerEvents: "none",
              }}
            />

            {/* Central Glowing Shield Icon */}
            <div
              style={{
                position: "absolute",
                bottom: "40px",
                right: "40px",
                width: "60px",
                height: "60px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #FF9A4A, #FF7A1A)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 30px rgba(255, 122, 26, 0.8)",
                zIndex: 2,
              }}
            >
              <ShieldCheck size={30} color="#FFFFFF" />
            </div>

            {/* Sessions Card from Video */}
            <div
              style={{
                position: "relative",
                zIndex: 2,
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                padding: "14px",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.07)",
                borderRadius: "10px",
                marginBottom: "12px",
                maxWidth: "280px",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: "rgba(255, 122, 26, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FF7A1A",
                  flexShrink: 0,
                }}
              >
                <Zap size={16} />
              </div>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#FFFFFF" }}>Sessions</div>
                <div style={{ fontSize: "11px", color: "#8E93A0", marginTop: "2px" }}>
                  Autonomous telemetry across running threads
                </div>
              </div>
            </div>

            {/* Live Chat Card from Video */}
            <div
              style={{
                position: "relative",
                zIndex: 2,
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                padding: "14px",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.07)",
                borderRadius: "10px",
                maxWidth: "260px",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: "rgba(56, 189, 248, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#38BDF8",
                  flexShrink: 0,
                }}
              >
                <MessageSquare size={16} />
              </div>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#FFFFFF" }}>Live Chat</div>
                <div style={{ fontSize: "11px", color: "#8E93A0", marginTop: "2px" }}>
                  Instant team updates and agent assistance
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 840px) {
          .glass-card {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
