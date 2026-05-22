

import {useNavigate} from 'react-router-dom';
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye, EyeOff, Mail, Lock, ArrowRight,
  GraduationCap, AlertCircle
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";

////imports for google authentication     

import {GoogleAuthProvider,signInWithPopup,
  signInWithEmailAndPassword
} from "firebase/auth";

import { auth } from "../../firebase";

/* ─── Starfield canvas ──────────────────────────────────── */
function Starfield() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const STAR_COUNT = 180;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.2 + 0.2,
      speed: Math.random() * 0.00012 + 0.00004,
      opacity: Math.random() * 0.6 + 0.2,
      twinkleOffset: Math.random() * Math.PI * 2,
    }));

    let t = 0;
    const draw = () => {
      t += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        s.y += s.speed;
        if (s.y > 1) s.y = 0;
        const twinkle = 0.5 + 0.5 * Math.sin(t * 0.04 + s.twinkleOffset);
        ctx.beginPath();
        ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 210, 255, ${s.opacity * twinkle})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}

/* ─── Glowing orbs in background ───────────────────────── */
function BackgroundOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Main purple orb */}
      <div
        className="absolute rounded-full"
        style={{
          width: "600px", height: "600px",
          top: "-120px", left: "-150px",
          background: "radial-gradient(circle, rgba(88, 28, 135, 0.45) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      {/* Blue orb */}
      <div
        className="absolute rounded-full"
        style={{
          width: "700px", height: "700px",
          bottom: "-200px", right: "-200px",
          background: "radial-gradient(circle, rgba(23, 37, 84, 0.7) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />
      {/* Accent cyan orb */}
      <div
        className="absolute rounded-full"
        style={{
          width: "300px", height: "300px",
          top: "40%", right: "20%",
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />
    </div>
  );
}

/* ─── Animated input field ──────────────────────────────── */
function InputField({ id, label, type, value, onChange, placeholder, icon: Icon, rightSlot, error, autoComplete }) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-semibold tracking-widest uppercase text-blue-300/70">
        {label}
      </label>
      <div className="relative">
        {/* Glow ring on focus */}
        <AnimatePresence>
          {focused && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute -inset-px rounded-2xl pointer-events-none"
              style={{
                background: "linear-gradient(135deg, rgba(139, 92, 246, 0.6), rgba(59, 130, 246, 0.6))",
                zIndex: 0,
                padding: "1px",
                borderRadius: "16px",
              }}
              aria-hidden="true"
            />
          )}
        </AnimatePresence>

        {/* Left icon */}
        <div
          className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none"
          style={{ zIndex: 2 }}
        >
          <Icon
            size={16}
            className={`transition-colors duration-200 ${
              focused ? "text-violet-400" : "text-blue-400/50"
            }`}
            aria-hidden="true"
          />
        </div>

        {/* Input */}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={!!error}
          className={`
            relative w-full pl-11 pr-${rightSlot ? "12" : "4"} py-3.5
            bg-white/[0.04] backdrop-blur-sm
            border rounded-2xl
            text-sm text-white placeholder-blue-300/30
            outline-none transition-all duration-200
            ${
              error
                ? "border-red-500/60"
                : focused
                ? "border-transparent bg-white/[0.07]"
                : "border-white/[0.08] hover:border-white/[0.15]"
            }
          `}
          style={{ zIndex: 1 }}
        />

        {/* Right slot (show/hide) */}
        {rightSlot && (
          <div
            className="absolute inset-y-0 right-0 flex items-center pr-3.5"
            style={{ zIndex: 3 }}
          >
            {rightSlot}
          </div>
        )}
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            role="alert"
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            className="flex items-center gap-1.5 text-xs text-red-400"
          >
            <AlertCircle size={12} aria-hidden="true" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Main SignIn component ─────────────────────────────── */
export default function SignIn() {

  const navigate = useNavigate();
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors]         = useState({});
  const [isLoading, setIsLoading]   = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [success, setSuccess]       = useState(false);

  /* Validation */
  const validate = () => {
    const e = {};
    if (!email.trim())
      e.email = "Email address is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Enter a valid email address";
    if (!password)
      e.password = "Password is required";
    else if (password.length < 6)
      e.password = "Password must be at least 6 characters";
    return e;
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    
    try { 
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
       if (error.code === "auth/user-not-found") {
      setErrors({
        email: "No account found with this email"
      });

    } else if (error.code === "auth/wrong-password") {

      setErrors({
        password: "Incorrect password"
      });

    } else if (error.code === "auth/invalid-credential") {

      setErrors({
        password: "Invalid email or password"
      });

    } else {

      setErrors({
        email: "Failed to sign in"
      });
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }

  };


////Adding google login for bonus 4. This is just a mock function that simulates a Google sign-in process with a loading state and then shows the success screen. In a real application, you would integrate with Google's OAuth API here.


  const provider =  new GoogleAuthProvider();

const handleGoogle = async () => {
  try {
    setGoogleLoading(true);

    const result = await signInWithPopup(auth, provider);

    console.log(result.user);

    navigate("/dashboard"); // Redirect to dashboard after successful sign-in

  } catch (error) {
    console.error(error);
  } finally {
    setGoogleLoading(false);
  }
};

  



  /* Card entrance variants */
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.07, delayChildren: 0.2 },
    },
  };
  const itemVariants = {
    hidden:   { opacity: 0, y: 18 },
    visible:  { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  };

  /* ── Success state ── */
  if (success) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: "linear-gradient(135deg, #030712 0%, #0f0c29 40%, #1a0533 70%, #030712 100%)" }}
      >
        <BackgroundOrbs />
        <Starfield />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          className="relative flex flex-col items-center gap-5 text-center"
          style={{ zIndex: 10 }}
        >
          <div className="w-20 h-20 rounded-full bg-violet-500/20 border border-violet-500/40 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            >
              <GraduationCap size={36} className="text-violet-400" />
            </motion.div>
          </div>
          <div>
            <h2
              className="text-2xl font-bold text-white mb-1"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Welcome back
            </h2>
            <p className="text-blue-300/60 text-sm">You're successfully signed in.</p>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ── Main render ── */
  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Instrument+Sans:wght@400;500;600&display=swap');
        * { font-family: 'Instrument Sans', sans-serif; }
        .font-display { font-family: 'Syne', sans-serif; }
        .scanlines::after {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255,255,255,0.012) 2px,
            rgba(255,255,255,0.012) 4px
          );
          pointer-events: none;
          border-radius: inherit;
        }
        @keyframes borderPulse {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1; }
        }
        .border-pulse { animation: borderPulse 4s ease-in-out infinite; }
      `}</style>

      <main
        className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #030712 0%, #0f0c29 40%, #1a0533 70%, #030712 100%)",
        }}
      >
        <BackgroundOrbs />
        <Starfield />

        {/* Decorative grid lines */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            zIndex: 1,
            backgroundImage:
              "linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
          aria-hidden="true"
        />

        {/* ─── Card ─── */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-md"
          style={{ zIndex: 10 }}
        >
          {/* Outer animated border glow */}
          <div
            className="absolute -inset-px rounded-3xl border-pulse"
            style={{
              background:
                "linear-gradient(135deg, rgba(139,92,246,0.35), rgba(59,130,246,0.2), rgba(139,92,246,0.1))",
              borderRadius: "24px",
              padding: "1px",
            }}
            aria-hidden="true"
          />

          {/* Glass card */}
          <div
            className="scanlines relative rounded-3xl overflow-hidden"
            style={{
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
              backdropFilter: "blur(24px) saturate(160%)",
              WebkitBackdropFilter: "blur(24px) saturate(160%)",
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow:
                "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.1), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            {/* Top accent bar */}
            <div
              className="h-px w-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(139,92,246,0.8), rgba(59,130,246,0.6), transparent)",
              }}
              aria-hidden="true"
            />

            <div className="px-8 py-9">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Header */}
                <motion.div variants={itemVariants} className="mb-8">
                  {/* Logo mark */}
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{
                        background: "linear-gradient(135deg, rgba(139,92,246,0.6), rgba(59,130,246,0.4))",
                        border: "1px solid rgba(139,92,246,0.4)",
                        boxShadow: "0 0 20px rgba(139,92,246,0.25)",
                      }}
                    >
                      <GraduationCap size={16} className="text-violet-200" aria-hidden="true" />
                    </div>
                    <span className="text-xs tracking-widest uppercase text-blue-300/50 font-semibold">
                      pulsedrift
                    </span>
                  </div>

                  <h1
                    className="font-display text-3xl font-bold text-white leading-tight mb-1.5"
                    style={{ letterSpacing: "-0.02em" }}
                  >
                    Welcome back
                  </h1>
                  <p className="text-sm text-blue-300/50">
                    Sign in to continue your session
                  </p>
                </motion.div>

                {/* Google button */}
                <motion.div variants={itemVariants}>
                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGoogle}
                    disabled={googleLoading || isLoading}
                    aria-label="Continue with Google"
                    className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl
                      text-sm font-semibold text-white/80
                      transition-all duration-200
                      disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.09)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    }}
                  >
                    {googleLoading ? (
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white/80 animate-spin" aria-hidden="true" />
                    ) : (
                      <FcGoogle size={17} aria-hidden="true" />
                    )}
                    {googleLoading ? "Connecting…" : "Continue with Google"}
                  </motion.button>
                </motion.div>

                {/* Divider */}
                <motion.div variants={itemVariants} className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                  <span className="text-xs text-blue-300/35 tracking-widest uppercase font-medium">
                    or sign in with email
                  </span>
                  <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                </motion.div>

                {/* Form */}
                <form onSubmit={handleSignIn} noValidate aria-label="Sign in form">
                  <motion.div variants={itemVariants} className="space-y-4">
                    {/* Email */}
                    <InputField
                      id="email"
                      label="Email address"
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }}
                      placeholder="you@example.com"
                      icon={Mail}
                      error={errors.email}
                      autoComplete="email"
                    />

                    {/* Password */}
                    <InputField
                      id="password"
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })); }}
                      placeholder="••••••••••"
                      icon={Lock}
                      error={errors.password}
                      autoComplete="current-password"
                      rightSlot={
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          className="text-blue-400/40 hover:text-blue-300/70 transition-colors duration-150 focus:outline-none focus-visible:text-violet-400"
                        >
                          {showPassword ? <EyeOff size={15} aria-hidden="true" /> : <Eye size={15} aria-hidden="true" />}
                        </button>
                      }
                    />
                  </motion.div>

                  {/* Remember me + Forgot password */}
                  <motion.div
                    variants={itemVariants}
                    className="flex items-center justify-between mt-4 mb-6"
                  >
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          id="remember"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="sr-only"
                        />
                        <motion.div
                          animate={{
                            background: rememberMe
                              ? "linear-gradient(135deg, #7c3aed, #3b82f6)"
                              : "rgba(255,255,255,0.04)",
                            borderColor: rememberMe
                              ? "rgba(139,92,246,0.8)"
                              : "rgba(255,255,255,0.12)",
                          }}
                          transition={{ duration: 0.15 }}
                          className="w-4 h-4 rounded-[5px] border flex items-center justify-center"
                          onClick={() => setRememberMe((v) => !v)}
                          role="presentation"
                          aria-hidden="true"
                        >
                          <AnimatePresence>
                            {rememberMe && (
                              <motion.svg
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ duration: 0.15 }}
                                width="10" height="10" viewBox="0 0 10 10"
                                fill="none" aria-hidden="true"
                              >
                                <path d="M1.5 5L3.8 7.5L8.5 2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                              </motion.svg>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      </div>
                      <span className="text-xs text-blue-300/45 group-hover:text-blue-300/65 transition-colors select-none">
                        Remember me
                      </span>
                    </label>

                    <button
                      type="button"
                      className="text-xs text-violet-400/70 hover:text-violet-300 transition-colors duration-150
                        focus:outline-none focus-visible:underline"
                    >
                      Forgot password?
                    </button>
                  </motion.div>

                  {/* Submit */}
                  <motion.div variants={itemVariants}>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isLoading || googleLoading}
                      aria-label="Sign in"
                      className="relative w-full py-3.5 rounded-2xl text-sm font-semibold text-white
                        overflow-hidden transition-all duration-200
                        disabled:opacity-60 disabled:cursor-not-allowed
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                      style={{
                        background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #2563eb 100%)",
                        boxShadow: "0 0 30px rgba(124,58,237,0.35), 0 4px 15px rgba(0,0,0,0.3)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = "0 0 50px rgba(124,58,237,0.55), 0 4px 20px rgba(0,0,0,0.4)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "0 0 30px rgba(124,58,237,0.35), 0 4px 15px rgba(0,0,0,0.3)";
                      }}
                    >
                      {/* Shine overlay */}
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                          background: "linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)",
                        }}
                        aria-hidden="true"
                      />

                      <span className="relative flex items-center justify-center gap-2">
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" aria-hidden="true" />
                            Signing in…
                          </>
                        ) : (
                          <>
                            Sign In
                            <ArrowRight size={15} aria-hidden="true" />
                          </>
                        )}
                      </span>
                    </motion.button>
                  </motion.div>
                </form>

                {/* Sign up link */}
                <motion.p
                  variants={itemVariants}
                  className="text-center text-xs text-blue-300/35 mt-6"
                >
                  Don't have an account?{" "}
                  <button
                  onClick={()=> navigate("/signup")}
                    type="button"
                    className="text-violet-400/80 hover:text-violet-300 font-semibold transition-colors duration-150
                      focus:outline-none focus-visible:underline"
                  >
                    Create one free
                  </button>
                </motion.p>
              </motion.div>
            </div>

            {/* Bottom accent bar */}
            <div
              className="h-px w-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(59,130,246,0.4), rgba(139,92,246,0.3), transparent)",
              }}
              aria-hidden="true"
            />
          </div>
        </motion.div>
      </main>
    </>
  );
  
}