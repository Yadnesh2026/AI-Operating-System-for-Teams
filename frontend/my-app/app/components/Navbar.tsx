"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, LogIn, Menu, UserPlus, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "Features", href: "#features" },
  { label: "Overview", href: "#dashboard" },
  { label: "Demo", href: "#ai-demo" },
  { label: "Documentation", href: "#features" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const prevScrollY = useRef(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 20);
      setVisible(currentY < prevScrollY.current || currentY < 80);
      prevScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNav = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: visible ? 0 : -80, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "4px 32px 0",
          height: "88px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: scrolled ? "rgba(7, 8, 11, 0.88)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid transparent",
          transition: "background 0.3s ease, border-color 0.3s ease",
        }}
      >
        {/* RedSun brand mark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            textDecoration: "none",
          }}
        >
          <Image
            src="/redsun-gradient-orbit-logo.png"
            alt="RedSun"
            width={120}
            height={80}
            priority
            style={{ width: "122px", height: "82px", objectFit: "contain", display: "block" }}
          />
        </a>

        {/* Center Navigation Links */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "28px",
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
          className="hidden md:flex"
        >
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNav(link.href)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "6px 2px",
                fontSize: "13px",
                fontWeight: 500,
                color: "#8E93A0",
                transition: "color 0.2s ease",
                letterSpacing: "-0.01em",
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#FFFFFF")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#8E93A0")}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Login and sign-up actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div className="nav-auth-desktop" style={{ alignItems: "center", gap: "14px" }}>
            <Link href="/dashboard" className="nav-auth-login"><LayoutDashboard size={15} /> Dashboard</Link>
            <Link href="/login" className="nav-auth-login"><LogIn size={15} /> Log in</Link>
            <Link href="/register" className="nav-auth-signup"><UserPlus size={15} /> Sign up</Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="nav-menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              padding: "8px",
              cursor: "pointer",
              color: "#F5F5F7",
              display: "flex",
              alignItems: "center",
            }}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile menu drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              top: "68px",
              left: 0,
              right: 0,
              zIndex: 99,
              background: "rgba(7, 8, 11, 0.98)",
              backdropFilter: "blur(20px)",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              padding: "20px 24px 28px",
            }}
          >
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNav(link.href)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "12px 0",
                  fontSize: "15px",
                  fontWeight: 500,
                  color: "#8E93A0",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                {link.label}
              </button>
            ))}
            <Link
              href="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="nav-auth-signup"
              style={{ width: "100%", marginTop: "20px" }}
            >
              <LayoutDashboard size={16} /> Dashboard
            </Link>
            <div className="mobile-auth-actions" style={{ marginTop: "20px" }}>
              <Link href="/login" onClick={() => setMenuOpen(false)} className="nav-auth-login"><LogIn size={16} /> Log in</Link>
              <Link href="/register" onClick={() => setMenuOpen(false)} className="nav-auth-signup"><UserPlus size={16} /> Sign up</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
