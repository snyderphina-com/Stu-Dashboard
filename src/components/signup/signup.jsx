import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";



const GOOGLE_ICON = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

/* ─────────────────────────────────────────────────────────────────
   PARTICLE CANVAS
───────────────────────────────────────────────────────────────── */
function ParticleField() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const COUNT = 120;
    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00015,
      vy: (Math.random() - 0.5) * 0.00015,
      r: Math.random() * 1.4 + 0.3,
      alpha: Math.random() * 0.55 + 0.1,
      phase: Math.random() * Math.PI * 2,
    }));

    // Connections
    let t = 0;
    const draw = () => {
      t += 0.4;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const W = canvas.width, H = canvas.height;

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = (particles[i].x - particles[j].x) * W;
          const dy = (particles[i].y - particles[j].y) * H;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(139,92,246,${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x * W, particles[i].y * H);
            ctx.lineTo(particles[j].x * W, particles[j].y * H);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
        if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;
        const twinkle = 0.5 + 0.5 * Math.sin(t * 0.04 + p.phase);
        ctx.beginPath();
        ctx.arc(p.x * W, p.y * H, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167,139,250,${p.alpha * twinkle})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} aria-hidden="true" />;
}

/* ─────────────────────────────────────────────────────────────────
   GLOWING ORBS
───────────────────────────────────────────────────────────────── */
function Orbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }} aria-hidden="true">
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute rounded-full"
        style={{ width: 700, height: 700, top: -200, left: -200,
          background: "radial-gradient(circle, rgba(88,28,135,0.5) 0%, transparent 70%)", filter: "blur(60px)" }}
      />
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.28, 0.45, 0.28] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute rounded-full"
        style={{ width: 600, height: 600, bottom: -150, right: -150,
          background: "radial-gradient(circle, rgba(29,78,216,0.45) 0%, transparent 70%)", filter: "blur(55px)" }}
      />
      <motion.div
        animate={{ x: [-20, 20, -20], y: [-10, 15, -10], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute rounded-full"
        style={{ width: 350, height: 350, top: "45%", left: "55%",
          background: "radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)", filter: "blur(40px)" }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   CORNER BRACKET — decorative neon corner accent
───────────────────────────────────────────────────────────────── */
function CornerBracket({ position }) {
  const posMap = {
    "top-left":     { top: -1, left: -1, borderTop: "1.5px solid", borderLeft: "1.5px solid" },
    "top-right":    { top: -1, right: -1, borderTop: "1.5px solid", borderRight: "1.5px solid" },
    "bottom-left":  { bottom: -1, left: -1, borderBottom: "1.5px solid", borderLeft: "1.5px solid" },
    "bottom-right": { bottom: -1, right: -1, borderBottom: "1.5px solid", borderRight: "1.5px solid" },
  };
  return (
    <div
      className="absolute w-5 h-5"
      style={{ ...posMap[position], borderColor: "rgba(139,92,246,0.8)", borderRadius: 2 }}
      aria-hidden="true"
    />
  );
}

/* ─────────────────────────────────────────────────────────────────
   INPUT FIELD
───────────────────────────────────────────────────────────────── */
function Field({ id, label, type, value, onChange, placeholder, icon, rightSlot, error, autoComplete }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-[0.65rem] font-semibold tracking-[0.22em] uppercase"
        style={{ color: "rgba(167,139,250,0.65)" }}>
        {label}
      </label>
      <div className="relative">
        {/* Focus glow ring */}
        <AnimatePresence>
          {focused && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute -inset-[1px] rounded-2xl pointer-events-none"
              style={{
                background: "linear-gradient(135deg, rgba(124,58,237,0.7), rgba(59,130,246,0.5))",
                zIndex: 0,
              }}
              aria-hidden="true"
            />
          )}
        </AnimatePresence>

        {/* Scan line sweep on focus */}
        <AnimatePresence>
          {focused && (
            <motion.div
              initial={{ top: "0%", opacity: 0.6 }}
              animate={{ top: "100%", opacity: 0 }}
              transition={{ duration: 0.6, ease: "linear" }}
              className="absolute inset-x-0 h-px pointer-events-none"
              style={{ background: "linear-gradient(90deg, transparent, rgba(167,139,250,0.8), transparent)", zIndex: 5 }}
              aria-hidden="true"
            />
          )}
        </AnimatePresence>

        {/* Left icon */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none" style={{ zIndex: 2 }}>
          <span className={`transition-colors duration-200 text-base ${focused ? "text-violet-400" : "text-white/25"}`}
            aria-hidden="true">
            {icon}
          </span>
        </div>

        <input
          id={id} type={type} value={value} onChange={onChange}
          placeholder={placeholder} autoComplete={autoComplete}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          aria-describedby={error ? `${id}-err` : undefined}
          aria-invalid={!!error}
          className={`
            relative w-full pl-11 pr-${rightSlot ? "12" : "4"} py-3.5 rounded-2xl text-sm
            text-white placeholder-white/20 outline-none
            transition-all duration-200
            ${error
              ? "border border-red-500/60 bg-red-950/20"
              : focused
                ? "border border-transparent bg-white/[0.07]"
                : "border border-white/[0.07] bg-white/[0.04] hover:border-white/[0.14] hover:bg-white/[0.06]"}
          `}
          style={{ zIndex: 1, fontFamily: "'Outfit', sans-serif" }}
        />

        {rightSlot && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3.5" style={{ zIndex: 3 }}>
            {rightSlot}
          </div>
        )}
      </div>

      <AnimatePresence>
        {error && (
          <motion.p id={`${id}-err`} role="alert"
            initial={{ opacity: 0, y: -4, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }} transition={{ duration: 0.2 }}
            className="flex items-center gap-1.5 text-xs text-red-400">
            <span aria-hidden="true">⚠</span> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   PASSWORD STRENGTH METER
───────────────────────────────────────────────────────────────── */
function StrengthMeter({ password }) {
  const score = !password ? 0
    : [/.{8,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter(r => r.test(password)).length;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "#ef4444", "#f59e0b", "#3b82f6", "#10b981"];
  if (!password) return null;
  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }} className="space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map(i => (
          <motion.div key={i} className="flex-1 h-0.5 rounded-full"
            animate={{ background: i <= score ? colors[score] : "rgba(255,255,255,0.08)" }}
            transition={{ duration: 0.3 }} />
        ))}
      </div>
      {score > 0 && (
        <p className="text-right text-[0.62rem] font-medium" style={{ color: colors[score] }}>
          {labels[score]}
        </p>
      )}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   FIREBASE ERROR → human-readable
───────────────────────────────────────────────────────────────── */
function parseFirebaseError(code) {
  const map = {
    "auth/email-already-in-use":   "This email is already registered. Try signing in.",
    "auth/invalid-email":          "Please enter a valid email address.",
    "auth/weak-password":          "Password is too weak. Use at least 6 characters.",
    "auth/network-request-failed": "Network error. Check your connection and try again.",
    "auth/popup-closed-by-user":   "Google sign-in was cancelled.",
    "auth/too-many-requests":      "Too many attempts. Please try again later.",
  };
  return map[code] || "Something went wrong. Please try again.";
}

/* ─────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────── */
export default function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPw, setShowPw]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors]         = useState({});
  const [firebaseErr, setFirebaseErr] = useState("");
  const [loading, setLoading]       = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [success, setSuccess]       = useState(false);

  const set = (key) => (e) => {
    setForm((p) => ({ ...p, [key]: e.target.value }));
    setErrors((p) => ({ ...p, [key]: "" }));
    setFirebaseErr("");
  };

  /* ── Validation ── */
  const validate = useCallback(() => {
    const e = {};
    if (!form.name.trim())                     e.name    = "Full name is required.";
    else if (form.name.trim().length < 2)      e.name    = "Enter your full name.";
    if (!form.email.trim())                    e.email   = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.password)                        e.password = "Password is required.";
    else if (form.password.length < 6)         e.password = "Minimum 6 characters.";
    if (!form.confirm)                         e.confirm  = "Please confirm your password.";
    else if (form.confirm !== form.password)   e.confirm  = "Passwords do not match.";
    return e;
  }, [form]);

  /* ── Email sign-up ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setFirebaseErr("");
    try {
      await createUserWithEmailAndPassword(auth, form.email.trim(), form.password);
      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
 console.log("SIGNUP ERROR:", err);
  console.log("CODE:", err.code);
  console.log("MESSAGE:", err.message);

      setFirebaseErr(parseFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  /* ── Google sign-up ── */
  const handleGoogle = async () => {
    setGoogleLoading(true);
    setFirebaseErr("");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
 console.log("GOOGLE SIGNUP ERROR:", err);
  console.log("CODE:", err.code);
  console.log("MESSAGE:", err.message);

      setFirebaseErr(parseFirebaseError(err.code));
    } finally {
      setGoogleLoading(false);
    }
  };

  /* ── Eye toggle button ── */
  const EyeBtn = ({ show, onToggle, label }) => (
    <button type="button" onClick={onToggle} aria-label={label}
      className="text-white/30 hover:text-violet-400 transition-colors duration-150 focus:outline-none focus-visible:text-violet-400">
      {show
        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
        : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
      }
    </button>
  );

  /* ── Animation variants ── */
  const pageVariants   = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.065, delayChildren: 0.25 } } };
  const itemVariants   = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } };
  const cardVariants   = { hidden: { opacity: 0, y: 36, scale: 0.97 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } } };

  /* ── Success overlay ── */
  const SuccessOverlay = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center gap-4 z-50"
      style={{ background: "rgba(10,5,30,0.9)", backdropFilter: "blur(8px)" }}>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 250, damping: 18 }}
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.6), rgba(59,130,246,0.4))", border: "1px solid rgba(139,92,246,0.5)" }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(167,139,250,1)" strokeWidth="2.5" aria-hidden="true">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </motion.div>
      <div className="text-center">
        <p className="text-white font-semibold text-lg" style={{ fontFamily: "'Syncopate', sans-serif" }}>Account Created</p>
        <p className="text-white/40 text-sm mt-1">Redirecting to dashboard…</p>
      </div>
    </motion.div>
  );

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700&family=Outfit:wght@300;400;500;600&display=swap');
        body { font-family: 'Outfit', sans-serif; }
        .font-display { font-family: 'Syncopate', sans-serif; }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px rgba(15,10,40,0.9) inset !important;
          -webkit-text-fill-color: white !important;
          caret-color: white;
          transition: background-color 9999s ease-in-out;
        }
      `}</style>

      {/* Full-page background */}
      <main
        className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #030616 0%, #0d0526 35%, #0f0428 60%, #060212 100%)" }}
      >
        <Orbs />
        <ParticleField />

        {/* Subtle grid */}
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1,
          backgroundImage: "linear-gradient(rgba(139,92,246,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.035) 1px, transparent 1px)",
          backgroundSize: "56px 56px" }} aria-hidden="true" />

        {/* ── Card ── */}
        <motion.div
          variants={cardVariants} initial="hidden" animate="visible"
          className="relative w-full max-w-[440px]"
          style={{ zIndex: 10 }}
        >
          {/* Outer glow border */}
          <div className="absolute -inset-[1px] rounded-3xl pointer-events-none"
            style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.45), rgba(59,130,246,0.2), rgba(124,58,237,0.1), rgba(59,130,246,0.3))",
              boxShadow: "0 0 60px rgba(124,58,237,0.2), 0 0 120px rgba(59,130,246,0.1)" }}
            aria-hidden="true" />

          {/* Glass surface */}
          <div className="relative rounded-3xl overflow-hidden"
            style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.018) 100%)",
              backdropFilter: "blur(28px) saturate(180%)", WebkitBackdropFilter: "blur(28px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.065)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.07)" }}>

            {/* Corner brackets */}
            <CornerBracket position="top-left" />
            <CornerBracket position="top-right" />
            <CornerBracket position="bottom-left" />
            <CornerBracket position="bottom-right" />

            {/* Top shimmer line */}
            <div className="h-px w-full"
              style={{ background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.9), rgba(59,130,246,0.7), transparent)" }}
              aria-hidden="true" />

            {/* Success overlay */}
            <AnimatePresence>{success && <SuccessOverlay />}</AnimatePresence>

            <div className="px-8 py-9">
              <motion.div variants={pageVariants} initial="hidden" animate="visible" className="space-y-5">

                {/* Header */}
                <motion.div variants={itemVariants} className="space-y-2">
                  {/* Brand mark */}
                  <div className="flex items-center gap-2.5 mb-5">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.7), rgba(59,130,246,0.5))",
                        border: "1px solid rgba(139,92,246,0.5)", boxShadow: "0 0 16px rgba(124,58,237,0.4)" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(196,181,253,1)" strokeWidth="2.5" aria-hidden="true">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    </div>
                    <span className="text-[0.62rem] tracking-[0.28em] uppercase font-semibold"
                      style={{ color: "rgba(167,139,250,0.55)" }}>Student Portal</span>
                  </div>

                  <h1 className="font-display text-2xl font-bold text-white leading-tight"
                    style={{ letterSpacing: "-0.01em" }}>
                    Create Account
                  </h1>
                  <p className="text-sm" style={{ color: "rgba(148,163,184,0.55)" }}>
                    Join the platform and start learning today.
                  </p>
                </motion.div>

                {/* Google button */}
                <motion.div variants={itemVariants}>
                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGoogle}
                    disabled={loading || googleLoading}
                    aria-label="Continue with Google"
                    className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl
                      text-sm font-medium text-white/75 transition-all duration-200
                      disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.09)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.16)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; }}
                  >
                    {googleLoading
                      ? <div className="w-4 h-4 rounded-full border-2 border-white/25 border-t-white/75 animate-spin" aria-hidden="true" />
                      : GOOGLE_ICON}
                    {googleLoading ? "Connecting…" : "Continue with Google"}
                  </motion.button>
                </motion.div>

                {/* Divider */}
                <motion.div variants={itemVariants} className="flex items-center gap-3">
                  <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} aria-hidden="true" />
                  <span className="text-[0.62rem] tracking-widest uppercase font-medium"
                    style={{ color: "rgba(148,163,184,0.35)" }}>or sign up with email</span>
                  <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} aria-hidden="true" />
                </motion.div>

                {/* Form */}
                <form onSubmit={handleSubmit} noValidate aria-label="Create account form">
                  <div className="space-y-4">
                    {/* Full name */}
                    <motion.div variants={itemVariants}>
                      <Field id="name" label="Full Name" type="text" value={form.name}
                        onChange={set("name")} placeholder="Jane Doe" icon="✦"
                        error={errors.name} autoComplete="name" />
                    </motion.div>

                    {/* Email */}
                    <motion.div variants={itemVariants}>
                      <Field id="email" label="Email Address" type="email" value={form.email}
                        onChange={set("email")} placeholder="jane@university.edu" icon="◎"
                        error={errors.email} autoComplete="email" />
                    </motion.div>

                    {/* Password */}
                    <motion.div variants={itemVariants}>
                      <Field id="password" label="Password" type={showPw ? "text" : "password"}
                        value={form.password} onChange={set("password")}
                        placeholder="Min. 6 characters" icon="◈"
                        error={errors.password} autoComplete="new-password"
                        rightSlot={<EyeBtn show={showPw} onToggle={() => setShowPw(v => !v)}
                          label={showPw ? "Hide password" : "Show password"} />}
                      />
                      <AnimatePresence>
                        {form.password && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }} className="mt-2">
                            <StrengthMeter password={form.password} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Confirm password */}
                    <motion.div variants={itemVariants}>
                      <Field id="confirm" label="Confirm Password" type={showConfirm ? "text" : "password"}
                        value={form.confirm} onChange={set("confirm")}
                        placeholder="Repeat your password" icon="◈"
                        error={errors.confirm} autoComplete="new-password"
                        rightSlot={<EyeBtn show={showConfirm} onToggle={() => setShowConfirm(v => !v)}
                          label={showConfirm ? "Hide confirm password" : "Show confirm password"} />}
                      />
                    </motion.div>

                    {/* Firebase error */}
                    <AnimatePresence>
                      {firebaseErr && (
                        <motion.div role="alert"
                          initial={{ opacity: 0, y: -6, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }}
                          exit={{ opacity: 0, y: -6, height: 0 }}
                          className="flex items-start gap-2.5 px-4 py-3 rounded-2xl text-xs text-red-300"
                          style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                          <span className="mt-0.5 flex-shrink-0" aria-hidden="true">⚠</span>
                          {firebaseErr}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Submit */}
                    <motion.div variants={itemVariants}>
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading || googleLoading}
                        aria-label="Create your account"
                        className="relative w-full py-3.5 rounded-2xl text-sm font-semibold text-white
                          overflow-hidden transition-all duration-200
                          disabled:opacity-60 disabled:cursor-not-allowed
                          focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500
                          focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                        style={{
                          background: "linear-gradient(135deg, #6d28d9 0%, #5b21b6 35%, #4338ca 70%, #3b82f6 100%)",
                          boxShadow: "0 0 28px rgba(109,40,217,0.45), 0 4px 16px rgba(0,0,0,0.35)",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 50px rgba(109,40,217,0.65), 0 4px 20px rgba(0,0,0,0.4)"; }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 28px rgba(109,40,217,0.45), 0 4px 16px rgba(0,0,0,0.35)"; }}
                      >
                        {/* Shine */}
                        <div className="absolute inset-0 opacity-25"
                          style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 60%)" }}
                          aria-hidden="true" />
                        <span className="relative flex items-center justify-center gap-2">
                          {loading
                            ? <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" aria-hidden="true" />Creating account…</>
                            : <>Create Account <span aria-hidden="true">→</span></>}
                        </span>
                      </motion.button>
                    </motion.div>
                  </div>
                </form>

                {/* Sign in link */}
                <motion.p variants={itemVariants} className="text-center text-xs"
                  style={{ color: "rgba(148,163,184,0.4)" }}>
                  Already have an account?{" "}
                  <Link to="/signin"
                    className="font-semibold transition-colors duration-150 focus:outline-none focus-visible:underline"
                    style={{ color: "rgba(167,139,250,0.8)" }}
                    onMouseEnter={e => { e.currentTarget.style.color = "rgba(196,181,253,1)"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "rgba(167,139,250,0.8)"; }}>
                    Sign in
                  </Link>
                </motion.p>

              </motion.div>
            </div>

            {/* Bottom shimmer line */}
            <div className="h-px w-full"
              style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.5), rgba(124,58,237,0.4), transparent)" }}
              aria-hidden="true" />
          </div>
        </motion.div>
      </main>
    </>
  );
}