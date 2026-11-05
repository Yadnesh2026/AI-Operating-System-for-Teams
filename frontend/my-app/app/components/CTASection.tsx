"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section
      id="cta"
      style={{
        padding: "140px 24px",
        position: "relative",
        overflow: "hidden",
        textAlign: "center",
        background: "#07080B",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "700px",
          height: "380px",
          background: "radial-gradient(ellipse, rgba(239, 68, 68, 0.12) 0%, rgba(239, 68, 68, 0.03) 45%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.3), transparent)",
        }}
      />

      <div style={{ maxWidth: "760px", margin: "0 auto", position: "relative", zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="pill-badge" style={{ marginBottom: "28px" }}>
            ✦ START BUILDING TODAY
          </div>
          <h2
            style={{
              fontSize: "clamp(36px, 6vw, 68px)",
              fontWeight: 800,
              letterSpacing: "-0.035em",
              color: "#FFFFFF",
              lineHeight: 1.1,
              marginBottom: "20px",
              fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
            }}
          >
            Make your team&apos;s next move
            <br />
            <span style={{ color: "#EF4444" }}>the smartest one.</span>
          </h2>
          <p
            style={{
              fontSize: "17px",
              color: "#8E93A0",
              lineHeight: 1.65,
              maxWidth: "520px",
              margin: "0 auto 40px",
            }}
          >
            Bring your people, projects, and knowledge together in one intelligent workspace.
          </p>

          {/* Symmetrically aligned CTA buttons */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <a
              href="#dashboard"
              className="btn-glow-orange"
              style={{ fontSize: "15px", padding: "14px 32px" }}
            >
              Get Started
              <ArrowRight size={16} />
            </a>
            <a
              href="#features"
              className="btn-subtle"
              style={{ fontSize: "15px", padding: "14px 30px" }}
            >
              Explore Platform
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const footerLinks = {
  Product: ["Overview", "Features", "Analytics", "Integrations", "Changelog"],
  Solutions: ["For Startups", "For Enterprises", "For Engineering", "Case Studies"],
  Resources: ["Documentation", "API Reference", "Tutorials", "Community"],
  Company: ["About Us", "Careers", "Privacy Policy", "Terms of Service"],
};

export function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(255, 255, 255, 0.07)",
        padding: "64px 24px 40px",
        background: "#07080B",
      }}
    >
      <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr repeat(4, 1fr)",
            gap: "40px",
            marginBottom: "48px",
          }}
          className="footer-grid"
        >
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "14px" }}>
              <span style={{ fontSize: "16px", fontWeight: 800, letterSpacing: "0.02em", color: "#FFFFFF" }}>
                REDSUN
              </span>
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#EF4444",
                  boxShadow: "0 0 8px #EF4444",
                }}
              />
            </div>
            <p style={{ fontSize: "13px", color: "#8E93A0", lineHeight: 1.65, maxWidth: "230px" }}>
              Intelligent operating system for engineering and product teams.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#FFFFFF",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginBottom: "16px",
                }}
              >
                {category}
              </div>
              {links.map((link) => (
                <div key={link} style={{ marginBottom: "10px" }}>
                  <a
                    href="#"
                    style={{
                      fontSize: "13px",
                      color: "#8E93A0",
                      textDecoration: "none",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#FFFFFF")}
                    onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#8E93A0")}
                  >
                    {link}
                  </a>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(255, 255, 255, 0.06)",
            paddingTop: "24px",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <span style={{ fontSize: "12px", color: "#8E93A0" }}>
            © 2026 RedSun Inc. All rights reserved.
          </span>
          <div style={{ display: "flex", gap: "20px" }}>
            {["Privacy", "Terms", "Security"].map((item) => (
              <a
                key={item}
                href="#"
                style={{ fontSize: "12px", color: "#8E93A0", textDecoration: "none" }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
