"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";

gsap.registerPlugin(ScrollTrigger);

const sidebarItems = [
  { label: "Overview", active: true },
  { label: "Projects" },
  { label: "Tasks" },
  { label: "Calendar" },
  { label: "Meetings" },
  { label: "Knowledge" },
  { label: "AI Assistant" },
  { label: "Settings" },
];

const tasks = [
  { name: "API Gateway integration", status: "In Progress", assignee: "AL", priority: "High" },
  { name: "Design system audit", status: "Review", assignee: "SM", priority: "Medium" },
  { name: "Q4 roadmap planning", status: "In Progress", assignee: "JK", priority: "High" },
  { name: "Performance optimization", status: "Todo", assignee: "DR", priority: "Medium" },
  { name: "Security assessment", status: "Done", assignee: "PL", priority: "Low" },
];

const projects = [
  { name: "Project Alpha", progress: 78, color: "#EF4444", daysLeft: 3 },
  { name: "Project Beta", progress: 45, color: "#8B5CF6", daysLeft: 12 },
  { name: "Project Gamma", progress: 92, color: "#4ADE80", daysLeft: 1 },
];

const meetings = [
  { title: "Sprint Review", time: "10:00 AM", duration: "1h", attendees: 8 },
  { title: "Design Sync", time: "2:30 PM", duration: "30m", attendees: 4 },
  { title: "Stakeholder Update", time: "4:00 PM", duration: "45m", attendees: 12 },
];

export default function ProductShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const projectCardsRef = useRef<HTMLDivElement>(null);
  const taskBoardRef = useRef<HTMLDivElement>(null);
  const aiPanelRef = useRef<HTMLDivElement>(null);
  const chartsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "bottom 30%",
          toggleActions: "play none none reverse",
        },
      });

      // Dashboard scales in
      tl.fromTo(
        dashboardRef.current,
        { scale: 0.9, opacity: 0, y: 40 },
        { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );

      // Sidebar slides in
      tl.fromTo(
        sidebarRef.current,
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      );

      // Project cards stagger in
      tl.fromTo(
        projectCardsRef.current ? projectCardsRef.current.children : [],
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: "power2.out" },
        "-=0.3"
      );

      // Task board
      tl.fromTo(
        taskBoardRef.current ? taskBoardRef.current.children : [],
        { x: 20, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.07, duration: 0.4, ease: "power2.out" },
        "-=0.3"
      );

      // AI panel slides in from right
      tl.fromTo(
        aiPanelRef.current,
        { x: 40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7, ease: "power2.out" },
        "-=0.4"
      );

      // Charts reveal
      tl.fromTo(
        chartsRef.current,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.6, ease: "power2.out" },
        "-=0.5"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="product"
      className="section-padding"
      style={{ padding: "120px 24px", position: "relative", overflow: "hidden" }}
    >
      {/* Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(8,9,13,0) 0%, rgba(13,15,20,0.8) 50%, rgba(8,9,13,0) 100%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative" }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: "64px" }}
        >
          <div className="pill-badge" style={{ marginBottom: "24px" }}>
            ✦ PRODUCT SHOWCASE
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
            Everything your team needs.
            <br />
            <span className="text-gradient-orange">One intelligent workspace.</span>
          </h2>
          <p
            style={{
              fontSize: "17px",
              color: "#9297A5",
              maxWidth: "540px",
              margin: "0 auto",
              lineHeight: 1.65,
            }}
          >
            One connected workspace for your projects, people, and decisions.
          </p>
        </motion.div>

        {/* Dashboard */}
        <div ref={dashboardRef}>
          <div
            style={{
              background: "rgba(13,15,20,0.95)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow:
                "0 0 0 1px rgba(255,255,255,0.05), 0 40px 100px rgba(0,0,0,0.6), 0 0 60px rgba(239, 68, 68,0.06)",
            }}
          >
            {/* Titlebar */}
            <div
              style={{
                padding: "14px 20px",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(8,9,13,0.6)",
              }}
            >
              <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#FF5F57" }} />
              <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#FFBD2E" }} />
              <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#28C840" }} />
              <div
                style={{
                  flex: 1,
                  height: "24px",
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: "5px",
                  marginLeft: "12px",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: "10px",
                }}
              >
                <span style={{ fontSize: "11px", color: "#9297A5" }}>app.nexora.ai/dashboard</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 10px",
                  background: "rgba(239, 68, 68,0.1)",
                  border: "1px solid rgba(239, 68, 68,0.2)",
                  borderRadius: "5px",
                }}
              >
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#EF4444" }} />
                <span style={{ fontSize: "10px", color: "#EF4444", fontWeight: 600 }}>Live</span>
              </div>
            </div>

            {/* Body */}
            <div style={{ display: "flex", minHeight: "560px" }}>
              {/* Sidebar */}
              <div
                ref={sidebarRef}
                style={{
                  width: "200px",
                  flexShrink: 0,
                  borderRight: "1px solid rgba(255,255,255,0.07)",
                  background: "rgba(8,9,13,0.5)",
                  padding: "20px 0",
                }}
                className="hidden lg:block"
              >
                {/* User info */}
                <div
                  style={{
                    padding: "0 16px 16px",
                    borderBottom: "1px solid rgba(255,255,255,0.07)",
                    marginBottom: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #EF4444, #8B5CF6)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "white",
                    }}
                  >
                    AJ
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "#F5F5F7" }}>Alex Johnson</div>
                    <div style={{ fontSize: "10px", color: "#9297A5" }}>Product Lead</div>
                  </div>
                </div>

                {sidebarItems.map((item) => (
                  <div
                    key={item.label}
                    style={{
                      padding: "9px 16px",
                      fontSize: "13px",
                      color: item.active ? "#EF4444" : "#9297A5",
                      background: item.active ? "rgba(239, 68, 68,0.08)" : "transparent",
                      borderLeft: item.active ? "2px solid #EF4444" : "2px solid transparent",
                      fontWeight: item.active ? 600 : 400,
                      cursor: "pointer",
                      letterSpacing: "-0.01em",
                      transition: "all 0.2s",
                    }}
                  >
                    {item.label}
                  </div>
                ))}
              </div>

              {/* Main content */}
              <div style={{ flex: 1, padding: "24px", overflow: "hidden", minWidth: 0 }}>
                {/* Header */}
                <div style={{ marginBottom: "24px" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#F5F5F7", letterSpacing: "-0.03em", marginBottom: "4px" }}>
                    Good morning, Alex 👋
                  </h3>
                  <p style={{ fontSize: "13px", color: "#9297A5" }}>
                    You have 3 tasks due today · Sprint review in 45 minutes
                  </p>
                </div>

                {/* Top row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                  {/* Projects */}
                  <div
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: "12px",
                      padding: "16px",
                    }}
                  >
                    <div style={{ fontSize: "11px", fontWeight: 600, color: "#9297A5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "14px" }}>
                      Active Projects
                    </div>
                    <div ref={projectCardsRef} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {projects.map((proj) => (
                        <div key={proj.name}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                            <span style={{ fontSize: "12px", color: "#F5F5F7", fontWeight: 500 }}>{proj.name}</span>
                            <span style={{ fontSize: "11px", color: "#9297A5" }}>{proj.daysLeft}d left</span>
                          </div>
                          <div style={{ height: "4px", background: "rgba(255,255,255,0.07)", borderRadius: "2px", overflow: "hidden" }}>
                            <div
                              style={{
                                height: "100%",
                                width: `${proj.progress}%`,
                                background: proj.color,
                                borderRadius: "2px",
                                transition: "width 1s ease",
                              }}
                            />
                          </div>
                          <div style={{ fontSize: "10px", color: proj.color, marginTop: "3px" }}>{proj.progress}%</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Meetings */}
                  <div
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: "12px",
                      padding: "16px",
                    }}
                  >
                    <div style={{ fontSize: "11px", fontWeight: 600, color: "#9297A5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "14px" }}>
                      Today&apos;s Meetings
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {meetings.map((m, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "8px",
                            background: i === 0 ? "rgba(239, 68, 68,0.06)" : "rgba(255,255,255,0.02)",
                            borderRadius: "8px",
                            border: i === 0 ? "1px solid rgba(239, 68, 68,0.15)" : "1px solid rgba(255,255,255,0.05)",
                          }}
                        >
                          <div
                            style={{
                              width: 3,
                              height: 32,
                              borderRadius: "2px",
                              background: i === 0 ? "#EF4444" : "rgba(255,255,255,0.15)",
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: "12px", color: "#F5F5F7", fontWeight: 500 }}>{m.title}</div>
                            <div style={{ fontSize: "10px", color: "#9297A5" }}>
                              {m.time} · {m.duration} · {m.attendees} people
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Task board */}
                <div
                  ref={taskBoardRef}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "12px",
                    padding: "16px",
                    marginBottom: "16px",
                  }}
                >
                  <div style={{ fontSize: "11px", fontWeight: 600, color: "#9297A5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "12px" }}>
                    Task Board
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {tasks.map((task, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          padding: "8px 10px",
                          background: "rgba(255,255,255,0.02)",
                          borderRadius: "7px",
                          border: "1px solid rgba(255,255,255,0.04)",
                        }}
                      >
                        <div
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background:
                              task.status === "Done"
                                ? "#4ADE80"
                                : task.status === "In Progress"
                                ? "#EF4444"
                                : task.status === "Review"
                                ? "#8B5CF6"
                                : "#9297A5",
                            flexShrink: 0,
                          }}
                        />
                        <span style={{ flex: 1, fontSize: "12px", color: "#F5F5F7" }}>{task.name}</span>
                        <div
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #EF4444, #8B5CF6)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "9px",
                            fontWeight: 700,
                            color: "white",
                          }}
                        >
                          {task.assignee}
                        </div>
                        <span
                          style={{
                            fontSize: "9px",
                            padding: "2px 8px",
                            borderRadius: "4px",
                            background:
                              task.status === "Done"
                                ? "rgba(74,222,128,0.1)"
                                : task.status === "In Progress"
                                ? "rgba(239, 68, 68,0.1)"
                                : task.status === "Review"
                                ? "rgba(139,92,246,0.1)"
                                : "rgba(146,151,165,0.1)",
                            color:
                              task.status === "Done"
                                ? "#4ADE80"
                                : task.status === "In Progress"
                                ? "#EF4444"
                                : task.status === "Review"
                                ? "#8B5CF6"
                                : "#9297A5",
                            fontWeight: 600,
                            letterSpacing: "0.04em",
                            textTransform: "uppercase",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {task.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI insight panel */}
              <div
                ref={aiPanelRef}
                style={{
                  width: "240px",
                  flexShrink: 0,
                  borderLeft: "1px solid rgba(255,255,255,0.07)",
                  background: "rgba(8,9,13,0.4)",
                  padding: "20px 16px",
                }}
                className="hidden xl:block"
              >
                <div style={{ fontSize: "11px", fontWeight: 600, color: "#9297A5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "16px" }}>
                  AI Insights
                </div>

                <div
                  style={{
                    background: "rgba(239, 68, 68,0.06)",
                    border: "1px solid rgba(239, 68, 68,0.15)",
                    borderRadius: "10px",
                    padding: "12px",
                    marginBottom: "12px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#EF4444",
                        boxShadow: "0 0 8px rgba(239, 68, 68,0.6)",
                      }}
                    />
                    <span style={{ fontSize: "10px", color: "#EF4444", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                      Risk Detected
                    </span>
                  </div>
                  <p style={{ fontSize: "12px", color: "#F5F5F7", lineHeight: 1.5, marginBottom: "6px" }}>
                    Project Gamma is 92% complete but has a critical dependency on Task #47 which is 3 days overdue.
                  </p>
                  <button
                    style={{
                      fontSize: "11px",
                      color: "#EF4444",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      fontWeight: 600,
                    }}
                  >
                    View details →
                  </button>
                </div>

                <div
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "10px",
                    padding: "12px",
                    marginBottom: "12px",
                  }}
                >
                  <div style={{ fontSize: "10px", color: "#9297A5", marginBottom: "8px", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                    Daily Summary
                  </div>
                  <p style={{ fontSize: "12px", color: "#F5F5F7", lineHeight: 1.5 }}>
                    Team velocity is up 6% this sprint. Focus on clearing 2 review-pending tasks to maintain cadence.
                  </p>
                </div>

                {/* Activity feed */}
                <div ref={chartsRef} style={{ transformOrigin: "left center" }}>
                  <div style={{ fontSize: "10px", color: "#9297A5", marginBottom: "10px", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                    Recent Activity
                  </div>
                  {[
                    { text: "Sarah completed Design System v2.1", time: "2m ago" },
                    { text: "Mike added 3 tasks to Sprint 14", time: "12m ago" },
                    { text: "AI flagged deadline risk on Alpha", time: "35m ago" },
                  ].map((activity, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "6px 0",
                        borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.05)" : "none",
                      }}
                    >
                      <div style={{ fontSize: "11px", color: "#F5F5F7", marginBottom: "2px", lineHeight: 1.4 }}>
                        {activity.text}
                      </div>
                      <div style={{ fontSize: "10px", color: "#9297A5" }}>{activity.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
