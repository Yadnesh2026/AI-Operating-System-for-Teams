"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Loader2 } from "lucide-react";

type DemoState = "idle" | "processing" | "done";

const processingSteps = [
  "Analyzing project tasks...",
  "Reviewing deadlines and blockers...",
  "Preparing sprint summary...",
];

const reportContent = {
  sprintProgress: {
    completed: 0,
    total: 0,
    percent: 0,
  },
  outstanding: [] as { name: string; owner: string; priority: string; due: string }[],
  blockers: [] as string[],
  recommendations: [] as string[],
};

export default function AIAssistantDemo() {
  const [state, setState] = useState<DemoState>("idle");
  const [currentStep, setCurrentStep] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const runDemo = () => {
    if (state !== "idle") return;
    setState("processing");
    setCurrentStep(0);

    let step = 0;
    intervalRef.current = setInterval(() => {
      step++;
      if (step < processingSteps.length) {
        setCurrentStep(step);
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setTimeout(() => setState("done"), 400);
      }
    }, 900);
  };

  const reset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setState("idle");
    setCurrentStep(0);
  };

  return (
    <section
      id="ai-demo"
      style={{ padding: "120px 24px", position: "relative", overflow: "hidden" }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "400px",
          background: "radial-gradient(ellipse, rgba(239, 68, 68,0.06) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "860px", margin: "0 auto", position: "relative" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: "56px" }}
        >
          <div className="pill-badge" style={{ marginBottom: "24px" }}>
            ✦ AI ASSISTANT
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
            Tell your AI what
            <br />
            <span className="text-gradient-orange">needs to happen.</span>
          </h2>
        </motion.div>

        {/* Demo interface */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{
            background: "rgba(13,15,20,0.95)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 40px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)",
          }}
        >
          {/* Header bar */}
          <div
            style={{
              padding: "14px 20px",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(8,9,13,0.5)",
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F57" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FFBD2E" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28C840" }} />
            <span style={{ marginLeft: "12px", fontSize: "12px", color: "#9297A5" }}>Nexora AI Assistant</span>
            <div
              style={{
                marginLeft: "auto",
                padding: "3px 8px",
                background: "rgba(74,222,128,0.1)",
                border: "1px solid rgba(74,222,128,0.2)",
                borderRadius: "4px",
                fontSize: "9px",
                color: "#4ADE80",
                fontWeight: 600,
              }}
            >
              Demo Mode
            </div>
          </div>

          <div style={{ padding: "28px" }}>
            {/* User prompt */}
            <div style={{ display: "flex", gap: "14px", marginBottom: "24px" }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #EF4444, #8B5CF6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "white",
                  flexShrink: 0,
                }}
              >
                AJ
              </div>
              <div
                style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px",
                  padding: "14px 16px",
                }}
              >
                <p style={{ fontSize: "14px", color: "#F5F5F7", lineHeight: 1.6, margin: 0 }}>
                  Ask about your projects, tasks, or team activity after connecting workspace data.
                </p>
              </div>
            </div>

            {/* Processing / result */}
            <AnimatePresence mode="wait">
              {state === "idle" && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "32px 0",
                  }}
                >
                  <button
                    onClick={runDemo}
                    className="btn-primary"
                    style={{ fontSize: "15px", padding: "13px 32px" }}
                  >
                    Run AI Analysis
                    <ArrowRight size={16} />
                  </button>
                </motion.div>
              )}

              {state === "processing" && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{ display: "flex", gap: "14px" }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "radial-gradient(circle, #FF6B6B, #EF4444)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 size={18} color="white" />
                    </motion.div>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      background: "rgba(239, 68, 68,0.05)",
                      border: "1px solid rgba(239, 68, 68,0.15)",
                      borderRadius: "12px",
                      padding: "14px 16px",
                    }}
                  >
                    {processingSteps.map((step, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: i <= currentStep ? 1 : 0.3, x: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: i < processingSteps.length - 1 ? "8px" : 0,
                          fontSize: "13px",
                          color: i <= currentStep ? "#F5F5F7" : "#9297A5",
                        }}
                      >
                        <div
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: i < currentStep ? "#4ADE80" : i === currentStep ? "#EF4444" : "#9297A5",
                          }}
                        />
                        {step}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {state === "done" && (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{ display: "flex", gap: "14px" }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "radial-gradient(circle, #FF6B6B, #EF4444)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: "16px" }}>⚡</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    {/* Sprint Progress */}
                    <div
                      style={{
                        background: "rgba(239, 68, 68,0.05)",
                        border: "1px solid rgba(239, 68, 68,0.15)",
                        borderRadius: "12px",
                        padding: "20px",
                        marginBottom: "16px",
                      }}
                    >
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "#EF4444", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "14px" }}>
                        Sprint Progress
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "10px" }}>
                        <div style={{ flex: 1, height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "3px" }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${reportContent.sprintProgress.percent}%` }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            style={{ height: "100%", background: "#EF4444", borderRadius: "3px" }}
                          />
                        </div>
                        <span style={{ fontSize: "14px", fontWeight: 700, color: "#EF4444", whiteSpace: "nowrap" }}>
                          {reportContent.sprintProgress.completed}/{reportContent.sprintProgress.total} tasks complete
                        </span>
                      </div>

                      {/* Outstanding tasks */}
                      <div style={{ fontSize: "11px", fontWeight: 600, color: "#9297A5", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "8px", marginTop: "16px" }}>
                        Outstanding Tasks
                      </div>
                      {reportContent.outstanding.map((task, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + i * 0.07 }}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "6px 0",
                            borderBottom: i < reportContent.outstanding.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                          }}
                        >
                          <div>
                            <span style={{ fontSize: "12px", color: "#F5F5F7" }}>{task.name}</span>
                            <span style={{ fontSize: "10px", color: "#9297A5", marginLeft: "8px" }}>→ {task.owner}</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span
                              style={{
                                fontSize: "9px",
                                padding: "2px 7px",
                                borderRadius: "4px",
                                background: task.priority === "High" ? "rgba(239, 68, 68,0.1)" : "rgba(146,151,165,0.1)",
                                color: task.priority === "High" ? "#EF4444" : "#9297A5",
                                fontWeight: 600,
                                textTransform: "uppercase",
                              }}
                            >
                              {task.priority}
                            </span>
                            <span style={{ fontSize: "10px", color: "#9297A5" }}>{task.due}</span>
                          </div>
                        </motion.div>
                      ))}
                      {reportContent.outstanding.length === 0 && <p style={{ color: "#9297A5", fontSize: "11px", margin: 0 }}>No task data available. Connect workspace data to create an analysis.</p>}
                    </div>

                    {/* Blockers */}
                    <div
                      style={{
                        background: "rgba(255,85,85,0.05)",
                        border: "1px solid rgba(255,85,85,0.15)",
                        borderRadius: "12px",
                        padding: "16px",
                        marginBottom: "16px",
                      }}
                    >
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "#FF5555", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "10px" }}>
                        ⚠ Potential Blockers
                      </div>
                      {reportContent.blockers.map((blocker, i) => (
                        <div key={i} style={{ display: "flex", gap: "8px", marginBottom: i < reportContent.blockers.length - 1 ? "6px" : 0 }}>
                          <span style={{ color: "#FF5555", fontSize: "11px" }}>•</span>
                          <span style={{ fontSize: "12px", color: "#F5F5F7" }}>{blocker}</span>
                        </div>
                      ))}
                      {reportContent.blockers.length === 0 && <span style={{ color: "#9297A5", fontSize: "11px" }}>No blocker data available.</span>}
                    </div>

                    {/* Recommendations */}
                    <div
                      style={{
                        background: "rgba(74,222,128,0.05)",
                        border: "1px solid rgba(74,222,128,0.15)",
                        borderRadius: "12px",
                        padding: "16px",
                        marginBottom: "20px",
                      }}
                    >
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "#4ADE80", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "10px" }}>
                        Recommended Next Steps
                      </div>
                      {reportContent.recommendations.map((rec, i) => (
                        <div key={i} style={{ display: "flex", gap: "8px", marginBottom: i < reportContent.recommendations.length - 1 ? "8px" : 0 }}>
                          <span style={{ color: "#4ADE80", fontSize: "12px", fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                          <span style={{ fontSize: "12px", color: "#F5F5F7", lineHeight: 1.5 }}>{rec}</span>
                        </div>
                      ))}
                      {reportContent.recommendations.length === 0 && <span style={{ color: "#9297A5", fontSize: "11px" }}>Recommendations will appear when workspace data is connected.</span>}
                    </div>

                    <button
                      onClick={reset}
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "7px",
                        padding: "8px 16px",
                        fontSize: "12px",
                        color: "#9297A5",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#F5F5F7")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#9297A5")}
                    >
                      Run Another Analysis
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
