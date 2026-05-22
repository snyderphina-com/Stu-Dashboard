import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SignIn from "../signin/signin";
import SignUp from "../signup/signup";


function ParticleField() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const pts = Array.from({ length: 90 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00008,
      vy: (Math.random() - 0.5) * 0.00008,
      r: Math.random() * 1.1 + 0.3,
      a: Math.random() * 0.4 + 0.08,
      ph: Math.random() * Math.PI * 2,
    }));

    let t = 0;
    const draw = () => {
      t++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const W = canvas.width, H = canvas.height;

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = (pts[i].x - pts[j].x) * W;
          const dy = (pts[i].y - pts[j].y) * H;
          const d = Math.hypot(dx, dy);
          if (d < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(109,40,217,${0.07 * (1 - d / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(pts[i].x * W, pts[i].y * H);
            ctx.lineTo(pts[j].x * W, pts[j].y * H);
            ctx.stroke();
          }
        }
      }

      pts.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
        if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;
        const tw = 0.55 + 0.45 * Math.sin(t * 0.035 + p.ph);
        ctx.beginPath();
        ctx.arc(p.x * W, p.y * H, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139,92,246,${p.a * tw})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas
      ref={ref}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}

/* ─────────────────────────────────────────────────────────────────
   BREATHING ORBS
───────────────────────────────────────────────────────────────── */
function Orbs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }} aria-hidden="true">
      {/* Top-left violet */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", width: 680, height: 680,
          top: -220, left: -220, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(109,40,217,0.45) 0%, transparent 68%)",
          filter: "blur(55px)",
        }}
      />
      {/* Bottom-right blue */}
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.22, 0.4, 0.22] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        style={{
          position: "absolute", width: 600, height: 600,
          bottom: -180, right: -180, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.38) 0%, transparent 68%)",
          filter: "blur(50px)",
        }}
      />
      {/* Mid accent */}
      <motion.div
        animate={{ x: [-18, 18, -18], y: [-10, 14, -10], opacity: [0.12, 0.22, 0.12] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        style={{
          position: "absolute", width: 320, height: 320,
          top: "38%", left: "52%", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.28) 0%, transparent 68%)",
          filter: "blur(40px)",
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   PULSE RING — radiates from the logo on load, loops
───────────────────────────────────────────────────────────────── */
function PulseRing() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
      {[0, 0.9, 1.8].map((delay, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0.5, opacity: 0.5 }}
          animate={{ scale: 3.2, opacity: 0 }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeOut", delay }}
          style={{
            position: "absolute",
            width: 56, height: 56,
            borderRadius: "50%",
            border: "1px solid rgba(124,58,237,0.55)",
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   LOGO MARK — hexagonal icon with glow
───────────────────────────────────────────────────────────────── */
function LogoMark() {
  return (
    <div className="relative flex items-center justify-center w-14 h-14">
      <PulseRing />
      <div
        style={{
          position: "relative", zIndex: 1,
          width: 56, height: 56,
          borderRadius: "14px",
          background: "linear-gradient(135deg, rgba(109,40,217,0.85) 0%, rgba(59,130,246,0.7) 100%)",
          border: "1px solid rgba(139,92,246,0.6)",
          boxShadow: "0 0 28px rgba(109,40,217,0.5), 0 0 60px rgba(59,130,246,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        {/* Stylised signal waveform icon */}
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
          <path d="M2 13h3.5l2.5-5 3 10 3-14 2.5 9H22" stroke="rgba(220,210,255,0.95)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="22.5" cy="13" r="1.5" fill="rgba(196,181,253,0.9)"/>
        </svg>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  const navigate = useNavigate();

  /* Stagger container */
  const container = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
  };
  const up = {
    hidden:  { opacity: 0, y: 22 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <>
      {/* ── Font import ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;600;700;800&family=DM+Mono:wght@300;400&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        .font-exo   { font-family: 'Exo 2', sans-serif; }
        .font-mono  { font-family: 'DM Mono', monospace; }
      `}</style>

      {/* ── Full-page shell ── */}
      <main
        className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden"
        style={{ background: "linear-gradient(150deg, #030616 0%, #0d0526 45%, #0f0428 75%, #030616 100%)" }}
      >
        <Orbs />
        <ParticleField />

        {/* Subtle grid */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            zIndex: 1,
            backgroundImage:
              "linear-gradient(rgba(109,40,217,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(109,40,217,0.028) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
          }}
          aria-hidden="true"
        />

        {/* ── Content ── */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="relative flex flex-col items-center gap-8 w-full max-w-sm"
          style={{ zIndex: 10 }}
        >
          {/* Logo + wordmark */}
          <motion.div variants={up} className="flex flex-col items-center gap-4">
            <LogoMark />
            <div className="text-center">
              <h1
                className="font-exo text-[2.6rem] font-extrabold leading-none tracking-[-0.03em] text-white"
                style={{
                  background: "linear-gradient(135deg, #fff 30%, rgba(196,181,253,0.85) 70%, rgba(147,197,253,0.7) 100%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 18px rgba(124,58,237,0.4))",
                }}
              >
                PulseHub
              </h1>
              <p
                className="font-mono text-[0.7rem] tracking-[0.22em] uppercase mt-2"
                style={{ color: "rgba(148,163,184,0.45)" }}
              >
                Your productivity starts here
              </p>
            </div>
          </motion.div>

          {/* ── Glass auth card ── */}
          <motion.div
            variants={up}
            className="w-full"
            style={{
              borderRadius: 20,
              padding: "2px",
              background: "linear-gradient(135deg, rgba(124,58,237,0.35), rgba(59,130,246,0.15), rgba(124,58,237,0.08))",
            }}
          >
            <div
              style={{
                borderRadius: 18,
                background: "linear-gradient(160deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.016) 100%)",
                backdropFilter: "blur(24px) saturate(160%)",
                WebkitBackdropFilter: "blur(24px) saturate(160%)",
                boxShadow: "0 24px 64px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.07)",
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.85rem",
              }}
            >
              {/* Login button */}
              <AuthButton
                label="Login"
                variant="outline"
                onClick={() => navigate("/signin")}
                ariaLabel="Go to sign in page"
              />
              {/* Sign Up button */}
              <AuthButton
                label="Sign Up"
                variant="filled"
                onClick={() => navigate("/signup")}
                ariaLabel="Go to sign up page"
              />

              {/* Fine print */}
              <p
                className="font-mono text-center text-[0.62rem] mt-1"
                style={{ color: "rgba(100,116,139,0.5)", letterSpacing: "0.06em" }}
              >
                No credit card required
              </p>
            </div>
          </motion.div>

          {/* Version badge */}
          <motion.div variants={up}>
            <div
              className="font-mono text-[0.6rem] tracking-widest uppercase"
              style={{ color: "rgba(100,116,139,0.3)", letterSpacing: "0.25em" }}
            >
              v1.0 · Early Access
            </div>
          </motion.div>
        </motion.div>
      </main>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────
   AUTH BUTTON — two variants: filled (primary) and outline
───────────────────────────────────────────────────────────────── */
function AuthButton({ label, variant, onClick, ariaLabel }) {
  const isFilled = variant === "filled";

  return (
    <motion.button
      whileHover={{ scale: 1.025, y: -1 }}
      whileTap={{ scale: 0.975 }}
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        width: "100%",
        padding: "0.9rem 1.5rem",
        borderRadius: 12,
        border: isFilled ? "none" : "1px solid rgba(124,58,237,0.35)",
        cursor: "pointer",
        fontFamily: "'Exo 2', sans-serif",
        fontSize: "0.9rem",
        fontWeight: 600,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: isFilled ? "#fff" : "rgba(196,181,253,0.85)",
        background: isFilled
          ? "linear-gradient(135deg, #6d28d9 0%, #5b21b6 40%, #3b82f6 100%)"
          : "rgba(109,40,217,0.08)",
        boxShadow: isFilled
          ? "0 0 24px rgba(109,40,217,0.4), 0 4px 14px rgba(0,0,0,0.3)"
          : "none",
        transition: "box-shadow 0.2s ease, background 0.2s ease",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        if (isFilled) {
          e.currentTarget.style.boxShadow = "0 0 44px rgba(109,40,217,0.65), 0 6px 20px rgba(0,0,0,0.35)";
        } else {
          e.currentTarget.style.background = "rgba(109,40,217,0.16)";
          e.currentTarget.style.borderColor = "rgba(139,92,246,0.6)";
          e.currentTarget.style.color = "rgba(216,180,254,1)";
        }
      }}
      onMouseLeave={(e) => {
        if (isFilled) {
          e.currentTarget.style.boxShadow = "0 0 24px rgba(109,40,217,0.4), 0 4px 14px rgba(0,0,0,0.3)";
        } else {
          e.currentTarget.style.background = "rgba(109,40,217,0.08)";
          e.currentTarget.style.borderColor = "rgba(124,58,237,0.35)";
          e.currentTarget.style.color = "rgba(196,181,253,0.85)";
        }
      }}
    >
      {/* Shine overlay on filled */}
      {isFilled && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 55%)",
            borderRadius: 12, pointerEvents: "none",
          }}
        />
      )}
      <span style={{ position: "relative" }}>{label}</span>
    </motion.button>
  );
}